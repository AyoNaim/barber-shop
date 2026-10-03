import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type BarberRecord = {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: barbers,
      error,
    } = await supabase
      .from("barbers")
      .select(
        `
          id,
          name,
          slug,
          role,
          bio,
          image_url
        `,
      )
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "[GET /api/barbers]",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load barbers.",
        },
        {
          status: 500,
        },
      );
    }

    const data = (barbers ?? []).map(
      (barber: BarberRecord) => ({
        id: barber.id,
        name: barber.name,
        slug: barber.slug,
        role: barber.role,
        bio: barber.bio,
        imageUrl: barber.image_url,
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
      "[GET /api/barbers]",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load barbers.",
      },
      {
        status: 500,
      },
    );
  }
}