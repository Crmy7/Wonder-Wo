// types/maux.ts

export interface ProduitRecette {
  id: number;
  nom: string;
  nomScientifique: string;
  dansPlacard: boolean;
  imageUrl: string;
  proprietes: string;
}

export interface ResultatRecherche {
  id: string;
  idRecette?: number | null;
  type: "recette" | "produit_simple";
  nomRecette: string;
  description: string;
  typeApplication: string;
  produits: ProduitRecette[];
  produitsPlacardDisponibles: number;
  sourceDocumentaire: string;
  adapteAuProfil: boolean;
  raisonNonAdapte: string | null;
  score: number;
  categorie: string;
  imageUrl: string;
  efficacite: number;
}

export interface ProfilUtilisateur {
  id?: number;
  nom?: string;
  age?: number;
  grossesse?: boolean;
  enfants?: boolean;
}

export interface RechercheRequest {
  symptome: string;
  profil?: ProfilUtilisateur;
}

export interface PlacardInfo {
  totalProduits: number;
  recettesAvecPlacard: number;
  recettesSansPlacard: number;
}

export interface ProduitRecommande {
  id: number;
  nom: string;
  count: number;
}

export interface IncitationPlacard {
  message: string;
  produitsRecommandes: ProduitRecommande[];
}

export interface RechercheResponse {
  success: boolean;
  symptome: string;
  profil?: ProfilUtilisateur;
  resultats: ResultatRecherche[];
  resultatsAvecPlacard?: ResultatRecherche[];
  resultatsAucunPlacard?: ResultatRecherche[];
  count: number;
  placardInfo: PlacardInfo;
  incitationPlacard?: IncitationPlacard | null;
  message: string;
}

export interface MauxPopulairesResponse {
  success: boolean;
  symptomes: string[];
  count: number;
  fromDatabase: boolean;
  error?: string;
}

export interface SuggestionMal {
  id: number;
  symptom: string;
  highlighted: string;
}

export interface SuggestionsResponse {
  success: boolean;
  suggestions: SuggestionMal[];
  count: number;
  searchTerm?: string;
  message: string;
}

// Types pour les codes de la base de données
export enum TypeRemede {
  TISANE = 1,
  DECOCTION = 2,
  CATAPLASME = 3,
  HUILE_BAUME = 4,
  SIROP = 5,
  TEINTURE = 6,
  AUTRE = 7,
}

export enum TypeApplication {
  USAGE_INTERNE = 1,
  USAGE_EXTERNE = 2,
  INHALATION = 3,
  BAIN = 4,
  GARGARISME = 5,
  AUTRE = 6,
}

export enum TrancheAge {
  ENFANT = 1,
  ADULTE = 2,
  SENIOR = 3,
}
