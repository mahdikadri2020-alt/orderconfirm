import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await adminClient.auth.signInWithPassword({
      email: "demo@orderconfirm.com",
      password: "Demo123456",
    });

    if (error) {
      return NextResponse.json(
        { error: "Impossible de lancer la démo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
