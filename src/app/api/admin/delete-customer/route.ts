import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "user_id est requis." }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: stores } = await admin
      .from("stores")
      .select("id")
      .eq("user_id", user_id);

    const storeIds = stores?.map((s) => s.id) || [];

    if (storeIds.length > 0) {
      const { data: orderIds } = await admin
        .from("orders")
        .select("id")
        .in("store_id", storeIds);

      const ids = orderIds?.map((o) => o.id) || [];

      if (ids.length > 0) {
        const { error: actErr } = await admin
          .from("order_activities")
          .delete()
          .in("order_id", ids);
        if (actErr) throw actErr;
      }

      const { error: ordErr } = await admin
        .from("orders")
        .delete()
        .in("store_id", storeIds);
      if (ordErr) throw ordErr;

      const { error: tmplErr } = await admin
        .from("message_templates")
        .delete()
        .in("store_id", storeIds);
      if (tmplErr) throw tmplErr;

      const { error: settErr } = await admin
        .from("settings")
        .delete()
        .in("store_id", storeIds);
      if (settErr) throw settErr;

      const { error: storeDelErr } = await admin
        .from("stores")
        .delete()
        .eq("user_id", user_id);
      if (storeDelErr) throw storeDelErr;
    }

    const { error: profErr } = await admin
      .from("profiles")
      .delete()
      .eq("id", user_id);
    if (profErr) throw profErr;

    const { error: userErr } = await admin
      .from("users")
      .delete()
      .eq("id", user_id);
    if (userErr) throw userErr;

    const { error: authErr } = await admin.auth.admin.deleteUser(user_id);
    if (authErr) throw authErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete customer error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de la suppression du client." },
      { status: 500 }
    );
  }
}
