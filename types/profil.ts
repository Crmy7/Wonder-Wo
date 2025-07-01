export interface Profil {
  id: number
  nom: string
  age: number
  grossesse: boolean
  enfants: boolean
  createdAt?: string
}

export interface CreateProfilData {
  nom: string
  age: number
  grossesse: boolean
  enfants: boolean
}

export interface ProfilResponse {
  success: boolean
  profil?: Profil
  profils?: Profil[]
  message?: string
  count?: number
} 