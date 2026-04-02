import { NextRequest, NextResponse } from "next/server";
import { createUpstreamHeaders } from "@/lib/server/forwardAuth";

const BACKEND_URL = `${process.env.VESTA_API_URL ?? "http://localhost:3001"}/api/v1/financing-profiles`;
const API_KEY = process.env.VESTA_API_KEY || "test";

async function parseBackendBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function forward(
  request: NextRequest,
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
): Promise<NextResponse> {
  const rawBody = method === "GET" ? undefined : await request.text();
  const headers = createUpstreamHeaders(request, {
    "x-api-key": API_KEY,
  });

  if (rawBody && rawBody.trim().length > 0) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: rawBody && rawBody.trim().length > 0 ? rawBody : undefined,
  });

  if (response.status === 204) {
    return new NextResponse(undefined, { status: 204 });
  }

  const data = await parseBackendBody(response);
  return NextResponse.json(data, { status: response.status });
}

function getForwardPath(request: NextRequest, includeSearch = false) {
  const pathname = request.nextUrl.pathname;
  const search = includeSearch ? request.nextUrl.search : "";
  return pathname.replace("/api/financing-profiles", "") + search;
}

export async function GET(request: NextRequest) {
  return forward(request, getForwardPath(request, true), "GET");
}

export async function POST(request: NextRequest) {
  return forward(request, getForwardPath(request, true), "POST");
}

export async function PATCH(request: NextRequest) {
  return forward(request, getForwardPath(request, true), "PATCH");
}

export async function DELETE(request: NextRequest) {
  return forward(request, getForwardPath(request, true), "DELETE");
}
