import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function createClient(request: NextRequest) {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });
}

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const cookieNames = cookies.map((c) => c.name);
  const authTokenCookie = cookies.find((c) => c.name.includes("supabase.auth.token"));
  const hasAuthCookie = !!authTokenCookie;

  const supabase = createClient(request);
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  let profile = null;
  let profileError = null;
  if (user) {
    const result = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    profile = result.data;
    profileError = result.error;
  }

  return NextResponse.json({
    cookieNames,
    hasAuthCookie,
    authCookiePrefix: hasAuthCookie ? authTokenCookie!.value.substring(0, 40) + "..." : null,
    getUserResult: { user: user ? { id: user.id, email: user.email } : null, error: getUserError },
    profile,
    profileError,
  });
}
