import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, event_id, referral_token } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email + event combination
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("email", email)
      .eq("Event_id", event_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "You've already registered for this event",
          registration_id: existing.id,
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("registrations")
      .insert({
        name,
        email,
        phone: phone || null,
        Event_id: event_id || null,
        referral_token: referral_token || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Registration error:", error);
      return NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      registration_id: data.id,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
