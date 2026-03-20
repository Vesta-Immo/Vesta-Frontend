import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PropertyListView from "./PropertyListView";
import PropertyResults from "./PropertyResults";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";

function createProperty(overrides?: Partial<PropertyItem>): PropertyItem {
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

function createResult(overrides?: Partial<PropertyWithResults>): PropertyWithResults {
  return {
    ...createProperty(),
    notaryFees: 10000,
    totalRenovationBudget: 0,
    requiredLoanAmount: 200000,
    monthlyCreditPayment: 1200,
    monthlyPaymentWithCharges: 1400,
    debtRatioPercent: 30,
    debtRatioLevel: "OK",
    ...overrides,
  };
}

describe("listing URL conditional rendering", () => {
  it("renders link in property list only when listingUrl exists", () => {
    render(
      <PropertyListView
        properties={[
          createProperty({ id: "a", listingUrl: "https://example.com/a" }),
          createProperty({ id: "b", addressOrSector: "Paris 11" }),
        ]}
        onEdit={vi.fn()}
        onDelete={vi.fn().mockResolvedValue(undefined)}
      />
    );

    const links = screen.getAllByRole("link", { name: /Voir l'annonce/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://example.com/a");
  });

  it("renders link in simulation results only when listingUrl exists", () => {
    render(
      <PropertyResults
        results={[
          createResult({ id: "a", listingUrl: "https://example.com/a" }),
          createResult({ id: "b", addressOrSector: "Paris 11", listingUrl: undefined }),
        ]}
      />
    );

    const links = screen.getAllByRole("link", { name: /Voir l'annonce/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://example.com/a");
  });
});
