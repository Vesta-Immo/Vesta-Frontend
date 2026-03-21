import { NextRequest, NextResponse } from "next/server";
import { createUpstreamHeaders } from "@/lib/server/forwardAuth";

const API_URL = process.env.SIMULATION_API_URL ?? "http://localhost:3001";
const API_KEY = process.env.SIMULATION_API_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const upstream = await fetch(
      `${API_URL}/api/v1/simulations/notary-fees/compute`,
      {
        method: "POST",
        headers: createUpstreamHeaders(req, {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        }),
        body: JSON.stringify(body),
      }
    );

    const data: unknown = await upstream.json();

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
