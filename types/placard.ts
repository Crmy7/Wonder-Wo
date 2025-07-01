// types/placard.ts

export interface PlacardItem {
    id: number
    produit: string
    IdProduit: number
    IdUser: number
    createdAt: string
    updatedAt?: string
    details?: ProduitDetails
  }
  
  export interface ProduitDetails {
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
  
  export interface PlacardResponse {
    success: boolean
    items?: PlacardItem[]
    item?: PlacardItem
    count?: number
    deletedCount?: number
    message?: string
    inPlacard?: boolean
  }
  
  export interface AddToPlacardRequest {
    IdProduit: number
  }