import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ServiceRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration_minutes: number;
  price: number;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: services,
      error,
    } = await supabase
      .from("services")
      .select(
        `
          id,
          name,
          slug,
          description,
          duration_minutes,
          price
        `,
      )
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "[GET /api/services]",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load services.",
        },
        {
          status: 500,
        },
      );
    }

    const data = (services ?? []).map(
      (service: ServiceRecord) => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        durationMinutes:
          service.duration_minutes,
        price: service.price,
      }),
    );

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "[GET /api/services]",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load services.",
      },
      {
        status: 500,
      },
    );
  }
}