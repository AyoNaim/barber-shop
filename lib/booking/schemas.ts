import { z } from "zod";

/**
 * Shared UUID validation.
 */
const uuidSchema = z.string().uuid();


/**
 * Customer information submitted when creating
 * an appointment.
 */
export const customerDetailsSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be less than 100 characters."),

  customerEmail: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email must be less than 255 characters."),

  customerPhone: z
    .string()
    .trim()
    .min(7, "Phone number is too short.")
    .max(30, "Phone number is too long."),

  customerNotes: z
    .string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters.")
    .optional(),
});


/**
 * Data required to create an appointment.
 *
 * The client provides the service, barber, date and
 * requested start time. The server determines the
 * actual end time from the service duration.
 */
export const createBookingSchema = customerDetailsSchema.extend({
  serviceId: uuidSchema,

  barberId: uuidSchema,

  appointmentDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must use YYYY-MM-DD format.",
    ),

  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Time must use HH:mm format.",
    ),
});


/**
 * Query parameters used when retrieving available
 * booking slots.
 */
export const availabilityQuerySchema = z.object({
  serviceId: uuidSchema,

  barberId: uuidSchema.optional(),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must use YYYY-MM-DD format.",
    ),
});


/**
 * Schema for identifying a service.
 */
export const serviceIdSchema = z.object({
  serviceId: uuidSchema,
});


/**
 * Schema for identifying a barber.
 */
export const barberIdSchema = z.object({
  barberId: uuidSchema,
});


export const appointmentSchema = z.object({
  id: uuidSchema,

  serviceId: uuidSchema,

  barberId: uuidSchema.nullable(),

  customerName: z.string(),

  customerEmail: z.string().email(),

  customerPhone: z.string(),

  appointmentDate: z.string(),

  startTime: z.string(),

  endTime: z.string(),

  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ]),

  customerNotes: z.string().nullable(),

  createdAt: z.string(),

  updatedAt: z.string(),
});


/**
 * Inferred TypeScript types.
 */
export type CustomerDetails = z.infer<
  typeof customerDetailsSchema
>;

export type CreateBookingInput = z.infer<
  typeof createBookingSchema
>;

export type AvailabilityQuery = z.infer<
  typeof availabilityQuerySchema
>;

export type Appointment = z.infer<
  typeof appointmentSchema
>;