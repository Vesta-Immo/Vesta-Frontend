import { NextRequest, NextResponse } from "next/server";
import { createUpstreamHeaders } from "@/lib/server/forwardAuth";

const BACKEND_URL = `${process.env.VESTA_API_URL}/api/v1/scenarios`;
const API_KEY = process.env.VESTA_API_KEY || "test";

async function parseBackendBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function forward(
  request: NextRequest,
  path: string,
  method: string,
): Promise<NextResponse> {
  const rawBody =
    method !== "GET" && method !== "HEAD" ? await request.text() : undefined;
  const headers = createUpstreamHeaders(request, {
    "x-api-key": API_KEY,
  });

  if (rawBody) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: rawBody,
  }).then(async (response) => {
    if (response.status === 204) {
      return new NextResponse(undefined, { status: 204 });
    }
    const data = await parseBackendBody(response);
    return NextResponse.json(data, { status: response.status });
  });
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const path = pathname.replace("/api/scenarios", "") + search;
  return forward(request, path, "GET");
}

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/scenarios", "");
  return forward(request, path, "POST");
}

export async function PATCH(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/scenarios", "");
  return forward(request, path, "PATCH");
}

export async function DELETE(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/scenarios", "");
  return forward(request, path, "DELETE");
}
