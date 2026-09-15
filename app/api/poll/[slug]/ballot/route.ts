import { getSavedBallot } from "@/lib/data/public-polls";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[0-9a-f]{32}$/.test(slug)) return Response.json({ error: "Not found" }, { status: 404 });
  const token = request.headers.get("x-voter-token") ?? "";
  if (!/^[0-9a-f]{64}$/.test(token)) return Response.json({ error: "Invalid token" }, { status: 400 });
  const ballot = await getSavedBallot(slug, token);
  return Response.json({ ballot }, { headers: { "Cache-Control": "no-store" } });
}
