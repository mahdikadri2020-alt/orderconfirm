import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_id } = body;

    if (!request_id) {
      return NextResponse.json(
        { error: "request_id est requis." },
        { status: 400 }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: accountRequest, error: fetchError } = await adminClient
      .from("account_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (fetchError || !accountRequest) {
      return NextResponse.json(
        { error: "Demande introuvable." },
        { status: 404 }
      );
    }

    if (accountRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Cette demande a déjà été traitée." },
        { status: 400 }
      );
    }

    if (!accountRequest.email || !accountRequest.password) {
      return NextResponse.json(
        {
          error: "Email ou mot de passe manquant dans la demande.",
        },
        { status: 400 }
      );
    }

    let userId: string;

    const { data: existingUsers } = await adminClient.auth.admin.listUsers();

    const existingUser = existingUsers?.users?.find(
      (u) => u.email === accountRequest.email
    );

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: authData, error: createUserError } =
        await adminClient.auth.admin.createUser({
          email: accountRequest.email,
          password: accountRequest.password,
          email_confirm: true,
          user_metadata: {
            full_name: accountRequest.full_name,
            store_name: accountRequest.store_name,
            whatsapp: accountRequest.whatsapp,
          },
        });

      if (createUserError) {
        return NextResponse.json(
          { error: createUserError.message },
          { status: 500 }
        );
      }

      userId = authData.user.id;
    }

    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existingProfile) {
      const { error: updateError } = await adminClient
        .from("profiles")
        .update({
          email: accountRequest.email,
          full_name: accountRequest.full_name,
          store_name: accountRequest.store_name,
          whatsapp: accountRequest.whatsapp,
          role: "customer",
        })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await adminClient
        .from("profiles")
        .insert({
          id: userId,
          email: accountRequest.email,
          full_name: accountRequest.full_name,
          store_name: accountRequest.store_name,
          whatsapp: accountRequest.whatsapp,
          role: "customer",
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    const { error: updateError } = await adminClient
      .from("account_requests")
      .update({ status: "approved" })
      .eq("id", request_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account approved successfully.",
    });
  } catch (error: any) {
    console.error("Approve Request Error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Erreur interne du serveur.",
      },
      { status: 500 }
    );
  }
}
