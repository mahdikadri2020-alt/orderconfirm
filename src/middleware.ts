import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const adminPaths = [
  "/admin/dashboard",
  "/admin/account-requests",
  "/admin/orders",
  "/admin/settings",
];
const customerPaths = [
  "/dashboard",
  "/dashboard/orders",
  "/dashboard/products",
  "/dashboard/customers",
  "/dashboard/profile",
  "/dashboard/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isCustomerPath = customerPaths.some((p) => pathname.startsWith(p));

  if (!isAdminPath && !isCustomerPath) {
    return NextResponse.next();
  }

  const { supabase, response } = await createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL(
      isAdminPath ? "/admin/login" : "/connexion",
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (isAdminPath && (!profile || profile.role !== "admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isCustomerPath && (!profile || profile.role !== "customer")) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
