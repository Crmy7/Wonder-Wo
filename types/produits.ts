export interface Produit {
  id: number
  nom: string
  nomScientifique: string
  famille: string
  partie: string
  composition: string
  formeGalenique: number
  proprietesPrincipales: string
  proprietesSecondaires: string
  utilisation: string
  precautions: string
  source: string
  imageUrl: string
  slug: string
}

export interface ProduitsResponse {
  success: boolean
  produits: Produit[]
  count: number
  message?: string
}