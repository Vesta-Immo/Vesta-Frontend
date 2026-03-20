import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PropertyForm from "./PropertyForm";
import type { PropertyItem } from "@/types/simulation";

function createInitialValues(overrides?: Partial<PropertyItem>): PropertyItem {
  return {
    id: "prop-1",
    status: "wanted",
    propertyType: "OLD",
    price: 250000,
    addressOrSector: "Lyon 7e",
    propertyTaxAnnual: 1200,
    coOwnershipFeesAnnual: 900,
    renovationWorkItems: [],
    ...overrides,
  };
}

describe("PropertyForm listingUrl validation", () => {
  it("accepts empty listing URL", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <PropertyForm
        onSubmit={onSubmit}
        initialValues={createInitialValues({ listingUrl: "" })}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Mettre à jour/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const payload = onSubmit.mock.calls[0][0] as PropertyItem;
    expect(payload.listingUrl).toBeUndefined();
  });

  it("rejects invalid listing URL", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<PropertyForm onSubmit={onSubmit} initialValues={createInitialValues()} />);

    fireEvent.change(screen.getByRole("textbox", { name: /Lien d.?annonce/i }), {
      target: { value: "not-a-valid-url" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Mettre à jour/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/URL valide/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts valid listing URL", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<PropertyForm onSubmit={onSubmit} initialValues={createInitialValues()} />);

    fireEvent.change(screen.getByRole("textbox", { name: /Lien d.?annonce/i }), {
      target: { value: "https://example.com/listing/42" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Mettre à jour/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const payload = onSubmit.mock.calls[0][0] as PropertyItem;
    expect(payload.listingUrl).toBe("https://example.com/listing/42");
  });
});
