import { createAdminClient } from "@/lib/supabase/admin";

import {
  calculateEndTime,
  timeToMinutes,
  validateBookingDate,
} from "@/lib/booking/validation";

import type { CreateBookingInput } from "@/lib/booking/schemas";

/**
 * Known booking error that can safely be returned
 * to the client with an appropriate HTTP status.
 */
export class BookingError extends Error {
  constructor(
    message: string,
    public readonly statusCode:
      | 400
      | 404
      | 409
      | 500,
  ) {
    super(message);

    this.name = "BookingError";
  }
}

type ServiceRecord = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
};

type BarberRecord = {
  id: string;
  name: string;
};

type AvailabilityRecord = {
  id: string;
  barber_id: string | null;
  type: "business_hours" | "blocked";
  day_of_week: number | null;
  start_time: string | null;
  end_time: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

type AppointmentRecord = {
  id: string;
  barber_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no_show";
};

type CreatedAppointment = {
  id: string;
  serviceId: string;
  barberId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no_show";
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

const ACTIVE_APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
] as const;

const LAGOS_TIMEZONE_OFFSET = "+01:00";

/**
 * Converts a database appointment into the API/domain
 * representation used by the rest of the application.
 */
function mapAppointment(
  appointment: Record<string, unknown>,
): CreatedAppointment {
  return {
    id: appointment.id as string,

    serviceId: appointment.service_id as string,

    barberId:
      (appointment.barber_id as string | null) ?? null,

    customerName:
      appointment.customer_name as string,

    customerEmail:
      appointment.customer_email as string,

    customerPhone:
      appointment.customer_phone as string,

    appointmentDate:
      appointment.appointment_date as string,

    startTime:
      appointment.start_time as string,

    endTime:
      appointment.end_time as string,

    status:
      appointment.status as CreatedAppointment["status"],

    customerNotes:
      (appointment.customer_notes as string | null) ??
      null,

    createdAt:
      appointment.created_at as string,

    updatedAt:
      appointment.updated_at as string,
  };
}

/**
 * Returns the day of week for a YYYY-MM-DD date.
 *
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
 *
 * UTC is used here intentionally because the input represents
 * a calendar date rather than an instant in time.
 */
function getDayOfWeek(date: string): number {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Date(
    Date.UTC(year, month - 1, day),
  ).getUTCDay();
}

/**
 * Checks whether two appointment time ranges overlap.
 *
 * Adjacent appointments are allowed:
 *
 * 09:00 - 09:45
 * 09:45 - 10:30
 *
 * These do not overlap.
 */
function rangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  const startAValue = timeToMinutes(startA);
  const endAValue = timeToMinutes(endA);

  const startBValue = timeToMinutes(startB);
  const endBValue = timeToMinutes(endB);

  return (
    startAValue < endBValue &&
    endAValue > startBValue
  );
}

/**
 * Ensures the requested appointment falls completely
 * inside one of the barber's working-hour windows.
 */
function isWithinBusinessHours(
  startTime: string,
  endTime: string,
  availability: AvailabilityRecord[],
): boolean {
  const requestedStart = timeToMinutes(startTime);
  const requestedEnd = timeToMinutes(endTime);

  return availability.some((record) => {
    if (
      !record.start_time ||
      !record.end_time
    ) {
      return false;
    }

    const businessStart = timeToMinutes(
      record.start_time,
    );

    const businessEnd = timeToMinutes(
      record.end_time,
    );

    return (
      requestedStart >= businessStart &&
      requestedEnd <= businessEnd
    );
  });
}

/**
 * Checks whether the requested appointment overlaps
 * an existing active appointment.
 */
function hasAppointmentConflict(
  startTime: string,
  endTime: string,
  appointments: AppointmentRecord[],
): boolean {
  return appointments.some((appointment) =>
    rangesOverlap(
      startTime,
      endTime,
      appointment.start_time,
      appointment.end_time,
    ),
  );
}

/**
 * Checks whether the requested appointment overlaps
 * a blocked period.
 *
 * Availability blocks are stored as timestamptz.
 *
 * Appointment times are local VAREL times, so they are
 * explicitly interpreted as Africa/Lagos (UTC+01:00).
 */
function hasBlockedPeriodConflict(
  date: string,
  startTime: string,
  endTime: string,
  blockedPeriods: AvailabilityRecord[],
): boolean {
  const requestedStart = new Date(
    `${date}T${startTime}:00${LAGOS_TIMEZONE_OFFSET}`,
  );

  const requestedEnd = new Date(
    `${date}T${endTime}:00${LAGOS_TIMEZONE_OFFSET}`,
  );

  return blockedPeriods.some((period) => {
    if (
      !period.starts_at ||
      !period.ends_at
    ) {
      return false;
    }

    const blockedStart = new Date(
      period.starts_at,
    );

    const blockedEnd = new Date(
      period.ends_at,
    );

    return (
      requestedStart < blockedEnd &&
      requestedEnd > blockedStart
    );
  });
}

/**
 * Creates a new appointment.
 *
 * This function performs all server-side booking rules:
 *
 * - validates the booking date
 * - verifies the service
 * - verifies the barber
 * - verifies the barber offers the service
 * - calculates the appointment end time
 * - verifies business hours
 * - checks blocked periods
 * - checks existing appointments
 * - inserts the appointment
 *
 * The function deliberately does not trust any endTime,
 * status, or generated database fields from the client.
 */
export async function createAppointment(
  input: CreateBookingInput,
): Promise<CreatedAppointment> {
  /*
   * --------------------------------------------------------
   * 1. Validate the requested date
   * --------------------------------------------------------
   */

  const dateError = validateBookingDate(
    input.appointmentDate,
  );

  if (dateError) {
    throw new BookingError(
      dateError,
      400,
    );
  }

  /*
   * --------------------------------------------------------
   * 2. Create Supabase server client
   * --------------------------------------------------------
   */

  const supabase = createAdminClient();

  /*
   * --------------------------------------------------------
   * 3. Get the selected service
   * --------------------------------------------------------
   */

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from("services")
    .select(
      `
        id,
        name,
        duration_minutes,
        price
      `,
    )
    .eq("id", input.serviceId)
    .eq("is_active", true)
    .maybeSingle<ServiceRecord>();

  if (serviceError) {
    console.error(
      "[createAppointment] Failed to load service:",
      serviceError,
    );

    throw new BookingError(
      "Unable to verify the selected service.",
      500,
    );
  }

  if (!service) {
    throw new BookingError(
      "The selected service does not exist or is no longer available.",
      404,
    );
  }

  /*
   * --------------------------------------------------------
   * 4. Get the selected barber
   * --------------------------------------------------------
   */

  const {
    data: barber,
    error: barberError,
  } = await supabase
    .from("barbers")
    .select(
      `
        id,
        name
      `,
    )
    .eq("id", input.barberId)
    .eq("is_active", true)
    .maybeSingle<BarberRecord>();

  if (barberError) {
    console.error(
      "[createAppointment] Failed to load barber:",
      barberError,
    );

    throw new BookingError(
      "Unable to verify the selected barber.",
      500,
    );
  }

  if (!barber) {
    throw new BookingError(
      "The selected barber does not exist or is no longer available.",
      404,
    );
  }

  /*
   * --------------------------------------------------------
   * 5. Verify barber can perform the service
   * --------------------------------------------------------
   */

  const {
    data: barberService,
    error: barberServiceError,
  } = await supabase
    .from("barber_services")
    .select("barber_id")
    .eq("barber_id", barber.id)
    .eq("service_id", service.id)
    .maybeSingle();

  if (barberServiceError) {
    console.error(
      "[createAppointment] Failed to verify barber service:",
      barberServiceError,
    );

    throw new BookingError(
      "Unable to verify whether the selected barber offers this service.",
      500,
    );
  }

  if (!barberService) {
    throw new BookingError(
      "This barber does not currently offer the selected service.",
      409,
    );
  }

  /*
   * --------------------------------------------------------
   * 6. Calculate appointment end time
   * --------------------------------------------------------
   *
   * The server derives this from the service duration.
   *
   * The client never gets to decide the end time.
   */

  const endTime = calculateEndTime(
    input.startTime,
    service.duration_minutes,
  );

  /*
   * --------------------------------------------------------
   * 7. Determine requested day of week
   * --------------------------------------------------------
   */

  const dayOfWeek = getDayOfWeek(
    input.appointmentDate,
  );

  /*
   * --------------------------------------------------------
   * 8. Get barber availability
   * --------------------------------------------------------
   */

  const {
    data: availability,
    error: availabilityError,
  } = await supabase
    .from("availability")
    .select(
      `
        id,
        barber_id,
        type,
        day_of_week,
        start_time,
        end_time,
        starts_at,
        ends_at
      `,
    )
    .eq("barber_id", barber.id)
    .eq("is_active", true);

  if (availabilityError) {
    console.error(
      "[createAppointment] Failed to load barber availability:",
      availabilityError,
    );

    throw new BookingError(
      "Unable to verify the barber's availability.",
      500,
    );
  }

  const availabilityRecords =
    (availability ?? []) as AvailabilityRecord[];

  /*
   * --------------------------------------------------------
   * 9. Check business hours
   * --------------------------------------------------------
   */

  const businessHours =
    availabilityRecords.filter(
      (record) =>
        record.type === "business_hours" &&
        record.day_of_week === dayOfWeek,
    );

  if (
    !isWithinBusinessHours(
      input.startTime,
      endTime,
      businessHours,
    )
  ) {
    throw new BookingError(
      "The selected time is outside this barber's working hours.",
      409,
    );
  }

  /*
   * --------------------------------------------------------
   * 10. Check blocked periods
   * --------------------------------------------------------
   */

  const blockedPeriods =
    availabilityRecords.filter(
      (record) =>
        record.type === "blocked",
    );

  if (
    hasBlockedPeriodConflict(
      input.appointmentDate,
      input.startTime,
      endTime,
      blockedPeriods,
    )
  ) {
    throw new BookingError(
      "The selected time is unavailable.",
      409,
    );
  }

  /*
   * --------------------------------------------------------
   * 11. Re-check existing appointments
   * --------------------------------------------------------
   *
   * Availability may have been checked moments earlier.
   * We check again immediately before inserting because
   * another customer may have booked the same barber/time.
   */

  const {
    data: existingAppointments,
    error: appointmentsError,
  } = await supabase
    .from("appointments")
    .select(
      `
        id,
        barber_id,
        appointment_date,
        start_time,
        end_time,
        status
      `,
    )
    .eq("barber_id", barber.id)
    .eq(
      "appointment_date",
      input.appointmentDate,
    )
    .in(
      "status",
      ACTIVE_APPOINTMENT_STATUSES,
    );

  if (appointmentsError) {
    console.error(
      "[createAppointment] Failed to check existing appointments:",
      appointmentsError,
    );

    throw new BookingError(
      "Unable to verify whether the selected time is available.",
      500,
    );
  }

  const appointmentRecords =
    (existingAppointments ??
      []) as AppointmentRecord[];

  if (
    hasAppointmentConflict(
      input.startTime,
      endTime,
      appointmentRecords,
    )
  ) {
    throw new BookingError(
      "This time has just been booked. Please choose another slot.",
      409,
    );
  }

  /*
   * --------------------------------------------------------
   * 12. Create appointment
   * --------------------------------------------------------
   */

  const {
    data: appointment,
    error: insertError,
  } = await supabase
    .from("appointments")
    .insert({
      service_id: service.id,
      barber_id: barber.id,

      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,

      appointment_date:
        input.appointmentDate,

      start_time: input.startTime,
      end_time: endTime,

      status: "pending",

      customer_notes:
        input.customerNotes ?? null,
    })
    .select(
      `
        id,
        service_id,
        barber_id,
        customer_name,
        customer_email,
        customer_phone,
        appointment_date,
        start_time,
        end_time,
        status,
        customer_notes,
        created_at,
        updated_at
      `,
    )
    .single();

  if (insertError) {
    console.error(
      "[createAppointment] Failed to create appointment:",
      insertError,
    );

    throw new BookingError(
      "Unable to create your booking right now. Please try again.",
      500,
    );
  }

  /*
   * --------------------------------------------------------
   * 13. Return clean domain representation
   * --------------------------------------------------------
   */

  return mapAppointment(appointment);
}