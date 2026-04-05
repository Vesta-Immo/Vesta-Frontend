export interface PrixImmoDepartement {
  codeDepartement: string;
  nomDepartement: string;
  typeBien: string;
  annee: number;
  prixMedianM2: number;
  nbTransactions: number;
  evolution1anPct: number | null;
  statut: string;
}

export interface PrixImmoRegion {
  nomRegion: string;
  typeBien: string;
  annee: number;
  prixMedianM2: number;
  nbTransactions: number;
  evolution1anPct: number | null;
  departements: string[];
}

export type PrixImmoRequest = {
  annee?: number;
  typeBien?: 'appartement' | 'maison' | 'tous';
};