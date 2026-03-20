import { addProperty, getPropertyList } from "./propertyListApi";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PropertyItem } from "@/types/simulation";

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

describe("propertyListApi listingUrl mapping", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("serializes payload without listingUrl when empty", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 })
    );

    await addProperty(createProperty({ listingUrl: "" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body).not.toHaveProperty("listingUrl");
  });

  it("deserializes listingUrl for list and simulation results", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          financingSettings: null,
          properties: [
            {
              ...createProperty({ listingUrl: null as unknown as string }),
            },
            {
              ...createProperty({ id: "prop-2", listingUrl: "https://example.com/a" }),
            },
          ],
          lastSimulation: {
            results: [
              {
                ...createProperty({ id: "prop-3", listingUrl: "https://example.com/b" }),
                notaryFees: 10000,
                totalRenovationBudget: 0,
                requiredLoanAmount: 200000,
                monthlyCreditPayment: 1200,
                monthlyPaymentWithCharges: 1400,
                debtRatioPercent: 32,
                debtRatioLevel: "OK",
              },
            ],
          },
        }),
        { status: 200 }
      )
    );

    const response = await getPropertyList();

    expect(response.properties[0].listingUrl).toBeUndefined();
    expect(response.properties[1].listingUrl).toBe("https://example.com/a");
    expect(response.lastSimulation?.results[0].listingUrl).toBe("https://example.com/b");
  });
});
