import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3001/api/v1/simulations/property-list";

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

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/proxy/property-list", "");

  try {
    const rawBody = await request.text();

    const headers: HeadersInit = {
      "x-api-key": process.env.BACKEND_API_KEY || "test",
    };

    const hasBody = rawBody.trim().length > 0;
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers,
      body: hasBody ? rawBody : undefined,
    });

    if (response.status === 204) {
      return new NextResponse(undefined, { status: 204 });
    }

    const data = await parseBackendBody(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/proxy/property-list", "");

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "test",
      },
    });

    const data = await parseBackendBody(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace("/api/proxy/property-list", "");

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY || "test",
      },
    });

    if (response.status === 204) {
      return new NextResponse(undefined, { status: 204 });
    }

    const data = await parseBackendBody(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
