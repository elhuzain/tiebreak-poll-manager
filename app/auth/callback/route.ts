import { NextResponse, type NextRequest } from "next/server";
import { confirmCreatorEmail } from "@/lib/data/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const tokenHash = request.nextUrl.searchParams.get("token_hash") ?? undefined;
  const type = request.nextUrl.searchParams.get("type");
  const confirmed = await confirmCreatorEmail({
    code,
    tokenHash: type === "email" ? tokenHash : undefined,
  });

  const destination = confirmed ? "/dashboard" : "/login?confirmation=failed";
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
