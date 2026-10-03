import { NextRequest, NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/booking/availability";
import {
  validateAvailabilityQuery,
} from "@/lib/booking/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const rawQuery = {
      serviceId: searchParams.get("serviceId"),
      barberId:
        searchParams.get("barberId") ?? undefined,
      date: searchParams.get("date"),
    };

    /*
     * --------------------------------------------------------
     * Validate query parameters
     * --------------------------------------------------------
     */

    const validation =
      validateAvailabilityQuery(rawQuery);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid availability request.",
          details: validation.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const {
      serviceId,
      barberId,
      date,
    } = validation.data;

    /*
     * --------------------------------------------------------
     * Get available slots
     * --------------------------------------------------------
     */

    const slots = await getAvailableSlots({
      serviceId,
      barberId,
      date,
    });

    /*
     * --------------------------------------------------------
     * Return successful response
     * --------------------------------------------------------
     */

    return NextResponse.json(
      {
        success: true,
        data: {
          date,
          serviceId,
          barberId: barberId ?? null,
          slots,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[GET /api/booking/availability]",
      error,
    );

    /*
     * Avoid exposing internal database errors directly
     * to the client.
     */

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve available booking slots.",
      },
      {
        status: 500,
      },
    );
  }
}