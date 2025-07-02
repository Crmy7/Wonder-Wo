// types/maux.ts

export interface ProduitRecette {
  id: number
  nom: string
  nomScientifique: string
  dansPlacard: boolean
  imageUrl: string
  proprietes: string
}

export interface ResultatRecherche {
  id: string
  type: 'recette' | 'produit_simple'
  nomRecette: string
  description: string
  typeApplication: string
  produits: ProduitRecette[]
  produitsPlacardDisponibles: number
  sourceDocumentaire: string
  adapteAuProfil: boolean
  raisonNonAdapte: string | null
  score: number
  categorie: string
  imageUrl: string
  efficacite: number
}

export interface ProfilUtilisateur {
  id?: number
  nom?: string
  age?: number
  grossesse?: boolean
  enfants?: boolean
}

export interface RechercheRequest {
  symptome: string
  profil?: ProfilUtilisateur
}

export interface PlacardInfo {
  totalProduits: number
  recettesAvecPlacard: number
  recettesSansPlacard: number
}

export interface RechercheResponse {
  success: boolean
  symptome: string
  profil?: ProfilUtilisateur
  resultats: ResultatRecherche[]
  count: number
  placardInfo: PlacardInfo
  message: string
}

// Types pour les codes de la base de données
export enum TypeRemede {
  TISANE = 1,
  DECOCTION = 2,
  CATAPLASME = 3,
  HUILE_BAUME = 4,
  SIROP = 5,
  TEINTURE = 6,
  AUTRE = 7
}

export enum TypeApplication {
  USAGE_INTERNE = 1,
  USAGE_EXTERNE = 2,
  INHALATION = 3,
  BAIN = 4,
  GARGARISME = 5,
  AUTRE = 6
}

export enum TrancheAge {
  ENFANT = 1,
  ADULTE = 2,
  SENIOR = 3
}