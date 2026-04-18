import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.VESTA_API_URL ?? "http://localhost:3001";
const API_KEY = process.env.VESTA_API_KEY ?? "";

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch(`${API_URL}/api/v1/ptz/conditions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

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
