import { z } from "zod";

import {
  availabilityQuerySchema,
  createBookingSchema,
} from "@/lib/booking/schemas";


export function isValidCalendarDate(
  value: string,
): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}


/**
 * Returns today's date in YYYY-MM-DD format.
 *
 * Booking dates should be interpreted using the business
 * timezone rather than the server's timezone.
 */
export function getTodayDate(
  timezone = "Africa/Lagos",
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


/**
 * Validates a booking date.
 *
 * Rules:
 * - Must be YYYY-MM-DD.
 * - Must be a real calendar date.
 * - Cannot be in the past.
 */
export function validateBookingDate(
  value: string,
): string | null {
  if (!isValidCalendarDate(value)) {
    return "Please provide a valid calendar date.";
  }

  const today = getTodayDate();

  if (value < today) {
    return "Booking date cannot be in the past.";
  }

  return null;
}


/**
 * Validates a booking start time.
 *
 * Database/API format:
 * HH:mm
 */
export function isValidTime(
  value: string,
): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}


/**
 * Converts HH:mm into minutes since midnight.
 *
 * Example:
 *
 * 09:30 → 570
 */
export function timeToMinutes(
  value: string,
): number {
  const [hours, minutes] = value
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}


/**
 * Converts minutes since midnight back to HH:mm.
 */
export function minutesToTime(
  totalMinutes: number,
): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;
}


/**
 * Calculates an appointment's end time from its start
 * time and the service duration.
 */
export function calculateEndTime(
  startTime: string,
  durationMinutes: number,
): string {
  if (!isValidTime(startTime)) {
    throw new Error("Invalid start time.");
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes <= 0
  ) {
    throw new Error("Invalid service duration.");
  }

  const endMinutes =
    timeToMinutes(startTime) + durationMinutes;

  if (endMinutes > 24 * 60) {
    throw new Error(
      "Appointment cannot extend beyond midnight.",
    );
  }

  return minutesToTime(endMinutes);
}


/**
 * Validates an appointment time against business hours.
 */
export function validateTimeRange(
  startTime: string,
  endTime: string,
  businessStart: string,
  businessEnd: string,
): string | null {
  if (!isValidTime(startTime)) {
    return "Invalid appointment start time.";
  }

  if (!isValidTime(endTime)) {
    return "Invalid appointment end time.";
  }

  if (!isValidTime(businessStart)) {
    return "Invalid business opening time.";
  }

  if (!isValidTime(businessEnd)) {
    return "Invalid business closing time.";
  }

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const opening = timeToMinutes(businessStart);
  const closing = timeToMinutes(businessEnd);

  if (start >= end) {
    return "Appointment start time must be before the end time.";
  }

  if (start < opening) {
    return "Appointment starts before business hours.";
  }

  if (end > closing) {
    return "Appointment extends beyond business hours.";
  }

  return null;
}


/**
 * Validates the complete booking request.
 *
 * This combines structural Zod validation with
 * booking-specific date rules.
 */
export function validateCreateBooking(
  input: unknown,
) {
  const result = createBookingSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      data: null,
      error: result.error,
    };
  }

  const dateError = validateBookingDate(
    result.data.appointmentDate,
  );

  if (dateError) {
    return {
      success: false as const,
      data: null,
      error: z
        .string()
        .transform(() => dateError)
        .safeParse(result.data.appointmentDate).error,
    };
  }

  return {
    success: true as const,
    data: result.data,
    error: null,
  };
}


/**
 * Validates an availability query.
 */
export function validateAvailabilityQuery(
  input: unknown,
) {
  const result =
    availabilityQuerySchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      data: null,
      error: result.error,
    };
  }

  const dateError = validateBookingDate(
    result.data.date,
  );

  if (dateError) {
    return {
      success: false as const,
      data: null,
      error: new Error(dateError),
    };
  }

  return {
    success: true as const,
    data: result.data,
    error: null,
  };
}