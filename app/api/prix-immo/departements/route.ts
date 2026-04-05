import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = process.env.VESTA_API_URL ?? "http://localhost:3001";
    const upstreamUrl = new URL("/api/v1/prix-immo/departements", apiUrl).toString();

    const { searchParams } = new URL(req.url);
    const annee = searchParams.get("annee");
    const typeBien = searchParams.get("typeBien");

    const params = new URLSearchParams();
    if (annee) params.set("annee", annee);
    if (typeBien) params.set("typeBien", typeBien);

    const upstream = await fetch(
      `${upstreamUrl}${params.toString() ? `?${params}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Service temporairement indisponible." },
      { status: 503 }
    );
  }
}