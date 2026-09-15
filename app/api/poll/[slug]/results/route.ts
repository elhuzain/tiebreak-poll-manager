import { getPublicResults } from "@/lib/data/public-polls";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[0-9a-f]{32}$/.test(slug)) return Response.json({ error: "Not found" }, { status: 404 });
  const results = await getPublicResults(slug);
  if (!results) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(results, { headers: { "Cache-Control": "no-store" } });
}
