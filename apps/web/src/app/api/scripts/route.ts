import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const defaultLimit = process.env.NODE_ENV === "development" ? "10" : "50";
  const limit = searchParams.get("limit") ?? defaultLimit;

  try {
    const upstreamResponse = await fetch(
      `https://api.getdione.app/v1/scripts?limit=${encodeURIComponent(limit)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstreamResponse.status}` },
        { status: upstreamResponse.status },
      );
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch scripts" },
      { status: 500 },
    );
  }
}


