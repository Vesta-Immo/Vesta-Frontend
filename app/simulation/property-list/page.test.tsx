import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PropertyListPage from "./page";

const loadPropertyList = vi.fn();

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/simulation/property-list",
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/usePropertyListStore", () => ({
  usePropertyListStore: vi.fn(),
}));

describe("PropertyListPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { useAuth } = await import("@/components/auth/AuthProvider");
    vi.mocked(useAuth).mockReturnValue({
      authLoading: false,
      signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn(),
      session: null,
      accessToken: null,
      user: null,
    });

    const { usePropertyListStore } = await import("@/lib/usePropertyListStore");
    vi.mocked(usePropertyListStore).mockReturnValue({
      financingSettings: null,
      properties: [],
      results: null,
      loading: false,
      error: null,
      loadPropertyList,
      updateFinancingSettings: vi.fn(),
      updateProperty: vi.fn(),
      removeProperty: vi.fn(),
    });
  });

  it("shows a sign-in invitation instead of property list content when logged out", () => {
    render(<PropertyListPage />);

    expect(
      screen.getByRole("heading", {
        name: /Connectez-vous pour retrouver vos pistes d'achat/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se connecter avec Google/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Vue d'ensemble de vos pistes/i)).not.toBeInTheDocument();
    expect(loadPropertyList).not.toHaveBeenCalled();
  });
});