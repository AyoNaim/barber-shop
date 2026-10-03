import { NextRequest, NextResponse } from "next/server";

import { createAppointment } from "@/lib/booking/appointments";
import { validateCreateBooking } from "@/lib/booking/validation";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      );
    }

    const validation = validateCreateBooking(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking request.",
          details: validation.error || "An error occurred",
        },
        {
          status: 400,
        },
      );
    }

    const appointment = await createAppointment(
      validation.data,
    );

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[POST /api/booking]", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create booking.";

    /**
     * These errors represent a valid request that can
     * no longer be fulfilled because the selected slot
     * is unavailable.
     */
    const conflictMessages = [
      "This time has just been booked.",
      "The selected time is unavailable.",
    ];

    const isConflict = conflictMessages.some((conflict) =>
      message.includes(conflict),
    );

    if (isConflict) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}