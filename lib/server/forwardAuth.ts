import { NextRequest } from "next/server";

export function createUpstreamHeaders(
  request: NextRequest,
  headersInit: HeadersInit = {}
) {
  const headers = new Headers(headersInit);
  const authorization = request.headers.get("authorization");

  if (authorization) {
    headers.set("authorization", authorization);
  }

  return headers;
}