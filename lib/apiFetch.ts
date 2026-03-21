import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

async function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const {
      data: { session },
    } = await getSupabaseBrowserClient().auth.getSession();

    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function withAuthorization(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  const accessToken = await getAccessToken();

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return nextHeaders;
}

async function getErrorMessage(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    return `HTTP ${response.status}: ${response.statusText}`;
  }

  try {
    const parsed = JSON.parse(rawText) as { message?: string };
    return parsed.message || `HTTP ${response.status}: ${response.statusText}`;
  } catch {
    return rawText;
  }
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = await withAuthorization(init.headers);

  return fetch(input, {
    ...init,
    headers,
  });
}

export async function requestJson<T>(input: RequestInfo | URL, init: RequestInit = {}) {
  const response = await apiFetch(input, init);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}