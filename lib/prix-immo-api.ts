import type { PrixImmoDepartement, PrixImmoRegion } from '../types/prix-immo';

function getBaseUrl() {
  // Server-side (SSR)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
  // Client-side: return '' (relative URL works)
}

export async function getDepartements(
  annee?: number,
  typeBien?: string
): Promise<PrixImmoDepartement[]> {
  const params = new URLSearchParams();
  if (annee !== undefined) params.set('annee', annee.toString());
  if (typeBien) params.set('typeBien', typeBien);

  const baseUrl = typeof window === 'undefined' ? getBaseUrl() : '';
  const url = `${baseUrl}/api/prix-immo/departements${params.toString() ? `?${params}` : ''}`;
  
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch departements: ${response.statusText}`);
  }

  return response.json();
}

export async function getRegions(
  annee?: number,
  typeBien?: string
): Promise<PrixImmoRegion[]> {
  const params = new URLSearchParams();
  if (annee !== undefined) params.set('annee', annee.toString());
  if (typeBien) params.set('typeBien', typeBien);

  const baseUrl = typeof window === 'undefined' ? getBaseUrl() : '';
  const url = `${baseUrl}/api/prix-immo/regions${params.toString() ? `?${params}` : ''}`;
  
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch regions: ${response.statusText}`);
  }

  return response.json();
}