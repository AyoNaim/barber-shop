import { createClient } from "@/lib/supabase/server";

import {
  calculateEndTime,
  minutesToTime,
  timeToMinutes,
} from "@/lib/booking/validation";

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

type ServiceRecord = {
  id: string;
  duration_minutes: number;
};

export type BookingSlot = {
  startTime: string;
  endTime: string;
  barberId: string;
};

const ACTIVE_APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
] as const;

const SLOT_INTERVAL_MINUTES = 15;


/**
 * Returns the JavaScript day-of-week for a YYYY-MM-DD date.
 *
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
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
 * Checks whether two time ranges overlap.
 *
 * Example:
 *
 * 09:00 - 10:00
 * 09:30 - 10:30
 *
 * => true
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
 * Checks whether a candidate slot overlaps
 * an existing appointment.
 */
function isSlotBooked(
  slotStart: string,
  slotEnd: string,
  appointments: AppointmentRecord[],
): boolean {
  return appointments.some((appointment) => {
    if (
      !ACTIVE_APPOINTMENT_STATUSES.includes(
        appointment.status as (typeof ACTIVE_APPOINTMENT_STATUSES)[number],
      )
    ) {
      return false;
    }

    return rangesOverlap(
      slotStart,
      slotEnd,
      appointment.start_time,
      appointment.end_time,
    );
  });
}


/**
 * Determines whether a candidate slot falls inside
 * a blocked period.
 *
 * Blocked availability records use timestamptz, so
 * comparison is performed using absolute timestamps.
 */
function isSlotBlocked(
  date: string,
  slotStart: string,
  slotEnd: string,
  blockedPeriods: AvailabilityRecord[],
): boolean {
  return blockedPeriods.some((period) => {
    if (
      !period.starts_at ||
      !period.ends_at
    ) {
      return false;
    }

    const slotStartDate = new Date(
      `${date}T${slotStart}:00`,
    );

    const slotEndDate = new Date(
      `${date}T${slotEnd}:00`,
    );

    const blockedStart = new Date(
      period.starts_at,
    );

    const blockedEnd = new Date(
      period.ends_at,
    );

    return (
      slotStartDate < blockedEnd &&
      slotEndDate > blockedStart
    );
  });
}


/**
 * Generates possible slots inside a business-hours window.
 */
function generateSlots(
  businessStart: string,
  businessEnd: string,
  durationMinutes: number,
): Array<{
  startTime: string;
  endTime: string;
}> {
  const start = timeToMinutes(businessStart);
  const end = timeToMinutes(businessEnd);

  const slots: Array<{
    startTime: string;
    endTime: string;
  }> = [];

  for (
    let current = start;
    current + durationMinutes <= end;
    current += SLOT_INTERVAL_MINUTES
  ) {
    const startTime = minutesToTime(current);

    const endTime = calculateEndTime(
      startTime,
      durationMinutes,
    );

    slots.push({
      startTime,
      endTime,
    });
  }

  return slots;
}


/**
 * Gets available booking slots for a service and date.
 *
 * If barberId is supplied, slots are generated only for
 * that barber.
 */
export async function getAvailableSlots({
  serviceId,
  date,
  barberId,
}: {
  serviceId: string;
  date: string;
  barberId?: string;
}): Promise<BookingSlot[]> {
  const supabase = await createClient();

  /*
   * --------------------------------------------------------
   * 1. Get service duration
   * --------------------------------------------------------
   */

  const { data: service, error: serviceError } =
    await supabase
      .from("services")
      .select("id, duration_minutes")
      .eq("id", serviceId)
      .eq("is_active", true)
      .maybeSingle<ServiceRecord>();

  if (serviceError) {
    throw new Error(
      `Failed to load service: ${serviceError.message}`,
    );
  }

  if (!service) {
    throw new Error("Service not found.");
  }


  /*
   * --------------------------------------------------------
   * 2. Determine requested day of week
   * --------------------------------------------------------
   */

  const dayOfWeek = getDayOfWeek(date);


  /*
   * --------------------------------------------------------
   * 3. Get active barbers
   * --------------------------------------------------------
   */

  let barberQuery = supabase
    .from("barbers")
    .select("id")
    .eq("is_active", true);

  if (barberId) {
    barberQuery = barberQuery.eq(
      "id",
      barberId,
    );
  }

  const { data: barbers, error: barberError } =
    await barberQuery;

  if (barberError) {
    throw new Error(
      `Failed to load barbers: ${barberError.message}`,
    );
  }

  if (!barbers || barbers.length === 0) {
    return [];
  }


  /*
   * --------------------------------------------------------
   * 4. Make sure each barber can perform the service
   * --------------------------------------------------------
   */

  const barberIds = barbers.map(
    (barber) => barber.id,
  );

  const { data: barberServices, error: serviceError2 } =
    await supabase
      .from("barber_services")
      .select("barber_id")
      .eq("service_id", serviceId)
      .in("barber_id", barberIds);

  if (serviceError2) {
    throw new Error(
      `Failed to load barber services: ${serviceError2.message}`,
    );
  }

  const qualifiedBarberIds = new Set(
    (barberServices ?? []).map(
      (item) => item.barber_id,
    ),
  );


  /*
   * --------------------------------------------------------
   * 5. Get availability records
   * --------------------------------------------------------
   */

  const { data: availability, error: availabilityError } =
    await supabase
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
      .eq("is_active", true);

  if (availabilityError) {
    throw new Error(
      `Failed to load availability: ${availabilityError.message}`,
    );
  }

  const availabilityRecords =
    (availability ?? []) as AvailabilityRecord[];


  /*
   * --------------------------------------------------------
   * 6. Get existing appointments for this date
   * --------------------------------------------------------
   */

  const { data: appointments, error: appointmentsError } =
    await supabase
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
      .eq("appointment_date", date)
      .in("status", ACTIVE_APPOINTMENT_STATUSES);

  if (appointmentsError) {
    throw new Error(
      `Failed to load appointments: ${appointmentsError.message}`,
    );
  }

  const appointmentRecords =
    (appointments ?? []) as AppointmentRecord[];


  /*
   * --------------------------------------------------------
   * 7. Generate slots for every qualified barber
   * --------------------------------------------------------
   */

  const availableSlots: BookingSlot[] = [];

  for (const barber of barbers) {
    if (!qualifiedBarberIds.has(barber.id)) {
      continue;
    }

    const barberAvailability =
      availabilityRecords.filter(
        (record) =>
          record.barber_id === barber.id &&
          record.type === "business_hours" &&
          record.day_of_week === dayOfWeek &&
          record.start_time &&
          record.end_time,
      );

    if (barberAvailability.length === 0) {
      continue;
    }

    const barberBlockedPeriods =
      availabilityRecords.filter(
        (record) =>
          record.barber_id === barber.id &&
          record.type === "blocked",
      );

    const barberAppointments =
      appointmentRecords.filter(
        (appointment) =>
          appointment.barber_id === barber.id,
      );

    for (const hours of barberAvailability) {
      const slots = generateSlots(
        hours.start_time!,
        hours.end_time!,
        service.duration_minutes,
      );

      for (const slot of slots) {
        if (
          isSlotBooked(
            slot.startTime,
            slot.endTime,
            barberAppointments,
          )
        ) {
          continue;
        }

        if (
          isSlotBlocked(
            date,
            slot.startTime,
            slot.endTime,
            barberBlockedPeriods,
          )
        ) {
          continue;
        }

        availableSlots.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          barberId: barber.id,
        });
      }
    }
  }

  return availableSlots.sort((a, b) => {
    const timeDifference =
      timeToMinutes(a.startTime) -
      timeToMinutes(b.startTime);

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return a.barberId.localeCompare(
      b.barberId,
    );
  });
}