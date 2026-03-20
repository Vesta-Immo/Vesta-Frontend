import type {
  FinancingSettings,
  PropertyItem,
  PropertyListResponse,
} from "@/types/simulation";

const BASE_URL = "/api/proxy/property-list";

async function request<TRes>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown
): Promise<TRes> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message: string | undefined;

    if (errorText) {
      try {
        const parsed = JSON.parse(errorText) as { message?: string };
        message = parsed?.message;
      } catch {
        message = errorText;
      }
    }

    throw new Error(message || `HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as TRes;
  }

  return response.json() as Promise<TRes>;
}

export async function saveSettings(
  settings: FinancingSettings
): Promise<void> {
  return request("POST", "/settings", settings);
}

export async function addProperty(property: PropertyItem): Promise<void> {
  return request("POST", "/items", property);
}

export async function getPropertyList(): Promise<PropertyListResponse> {
  return request("GET", "/items");
}

export async function deleteProperty(propertyId: string): Promise<void> {
  return request("DELETE", `/items/${propertyId}`);
}
