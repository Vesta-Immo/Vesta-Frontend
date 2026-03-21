import type {
  FinancingSettings,
  PropertyListSimulation,
  PropertyItem,
  PropertyListResponse,
} from "@/types/simulation";
import { requestJson } from "@/lib/apiFetch";

const BASE_URL = "/api/proxy/property-list";

function toPropertyRequest(property: PropertyItem): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ...property,
  };

  if (!property.listingUrl) {
    delete payload.listingUrl;
  }

  return payload;
}

function fromProperty<T extends PropertyItem>(raw: T): T {
  return {
    ...raw,
    listingUrl: raw.listingUrl || undefined,
  } as T;
}

function fromSimulation(raw?: PropertyListSimulation | null): PropertyListSimulation | null {
  if (!raw) {
    return null;
  }

  return {
    ...raw,
    results: raw.results.map(fromProperty),
  };
}

function fromPropertyListResponse(raw: PropertyListResponse): PropertyListResponse {
  return {
    ...raw,
    properties: raw.properties.map(fromProperty),
    lastSimulation: fromSimulation(raw.lastSimulation),
  };
}

async function request<TRes>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown
): Promise<TRes> {
  return requestJson<TRes>(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function saveSettings(
  settings: FinancingSettings
): Promise<void> {
  return request("POST", "/settings", settings);
}

export async function addProperty(property: PropertyItem): Promise<void> {
  return request("POST", "/items", toPropertyRequest(property));
}

export async function getPropertyList(): Promise<PropertyListResponse> {
  const response = await request<PropertyListResponse>("GET", "/items");
  return fromPropertyListResponse(response);
}

export async function deleteProperty(propertyId: string): Promise<void> {
  return request("DELETE", `/items/${propertyId}`);
}
