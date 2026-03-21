import { afterEach, describe, expect, it, vi } from "vitest";
import { requestJson } from "./apiFetch";
import { getSupabaseBrowserClient } from "./supabase/browser";

vi.mock("./supabase/browser", () => ({
  getSupabaseBrowserClient: vi.fn(),
}));

describe("apiFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(getSupabaseBrowserClient).mockReset();
  });

  it("adds the Supabase bearer token to authenticated requests", async () => {
    vi.mocked(getSupabaseBrowserClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: "jwt-token" } },
        }),
      },
    } as never);

    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await requestJson<{ ok: boolean }>("/api/test", { method: "GET" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer jwt-token");
  });

  it("keeps requests anonymous when no session exists", async () => {
    vi.mocked(getSupabaseBrowserClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
        }),
      },
    } as never);

    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await requestJson<{ ok: boolean }>("/api/test", { method: "GET" });

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.has("Authorization")).toBe(false);
  });
});