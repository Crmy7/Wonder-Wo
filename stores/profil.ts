import { defineStore } from 'pinia'
import type { Profil } from '~/types/profil'

interface ProfilState {
  profils: Profil[]
  currentProfil: Profil | null
  loading: boolean
  error: string
}

export const useProfilStore = defineStore('profil', {
  state: (): ProfilState => ({
    profils: [],
    currentProfil: null,
    loading: false,
    error: ''
  }),

  getters: {
    hasProfiles: (state) => state.profils.length > 0,
    currentProfilId: (state) => state.currentProfil?.id || null,
    profilCount: (state) => state.profils.length
  },

  actions: {
    // Charger tous les profils de l'utilisateur
    async loadProfils() {
      this.loading = true
      this.error = ''
      
      try {
        console.log('🔄 Chargement des profils...')
        const data = await $fetch('/api/profil/list')
        this.profils = data.profils || []
        
        console.log('✅ Profils chargés:', this.profils.length)
        
        // Restaurer le profil actif depuis les cookies
        await this.restoreCurrentProfil()
        
        return { success: true, profils: this.profils }
        
      } catch (error: any) {
        console.error('❌ Erreur chargement profils:', error)
        this.error = error.statusMessage || 'Erreur lors du chargement des profils'
        throw error
        
      } finally {
        this.loading = false
      }
    },

    // Sélectionner un profil actif
    async selectProfil(profil: Profil) {
      console.log('🎯 Sélection du profil:', profil.nom)
      
      this.currentProfil = profil
      
      // Sauvegarder dans les cookies
      const selectedProfilCookie = useCookie('selectedProfil', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        serialize: JSON.stringify,
        deserialize: JSON.parse
      })
      
      selectedProfilCookie.value = {
        id: profil.id,
        nom: profil.nom,
        age: profil.age,
        grossesse: profil.grossesse,
        enfants: profil.enfants
      }
      
      console.log('✅ Profil sauvegardé en cookies')
    },

    // Restaurer le profil actif depuis les cookies
    async restoreCurrentProfil() {
      const selectedProfilCookie = useCookie('selectedProfil', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 30,
        serialize: JSON.stringify,
        deserialize: JSON.parse
      })
      
      if (selectedProfilCookie.value && this.profils.length > 0) {
        const savedProfil = selectedProfilCookie.value
        
        // Chercher le profil correspondant dans la liste actuelle
        const foundProfil = this.profils.find(p => p.id === savedProfil.id)
        
        if (foundProfil) {
          this.currentProfil = foundProfil
          console.log('🔄 Profil restauré depuis les cookies:', foundProfil.nom)
        } else {
          // Le profil n'existe plus, prendre le premier disponible
          this.currentProfil = this.profils[0]
          await this.selectProfil(this.currentProfil)
          console.log('⚠️ Profil inexistant, sélection du premier:', this.currentProfil.nom)
        }
      } else if (this.profils.length > 0) {
        // Aucun profil sauvegardé, prendre le premier
        this.currentProfil = this.profils[0]
        await this.selectProfil(this.currentProfil)
        console.log('📝 Premier profil sélectionné par défaut:', this.currentProfil.nom)
      }
    },

    // Créer un nouveau profil
    async createProfil(profilData: Omit<Profil, 'id'>) {
      this.loading = true
      this.error = ''
      
      try {
        console.log('➕ Création d\'un nouveau profil:', profilData.nom)
        
        const data = await $fetch('/api/profil/create', {
          method: 'POST',
          body: profilData
        })
        
        // Recharger la liste complète
        await this.loadProfils()
        
        // Sélectionner automatiquement le nouveau profil
        const newProfil = this.profils.find(p => p.nom === profilData.nom)
        if (newProfil) {
          await this.selectProfil(newProfil)
        }
        
        console.log('✅ Profil créé et sélectionné')
        return { success: true, message: data.message }
        
      } catch (error: any) {
        console.error('❌ Erreur création profil:', error)
        this.error = error.statusMessage || 'Erreur lors de la création du profil'
        throw error
        
      } finally {
        this.loading = false
      }
    },

    // Supprimer un profil
    async deleteProfil(profilId: number) {
      this.loading = true
      this.error = ''
      
      try {
        console.log('🗑️ Suppression du profil ID:', profilId)
        
        await $fetch(`/api/profil/${profilId}`, {
          method: 'DELETE'
        })
        
        // Si c'était le profil actif, le reset
        if (this.currentProfil?.id === profilId) {
          this.currentProfil = null
          
          // Effacer le cookie
          const selectedProfilCookie = useCookie('selectedProfil')
          selectedProfilCookie.value = null
        }
        
        // Recharger la liste
        await this.loadProfils()
        
        console.log('✅ Profil supprimé')
        return { success: true }
        
      } catch (error: any) {
        console.error('❌ Erreur suppression profil:', error)
        this.error = error.statusMessage || 'Erreur lors de la suppression du profil'
        throw error
        
      } finally {
        this.loading = false
      }
    },

    // Reset du store (déconnexion)
    resetStore() {
      console.log('🔄 Reset du store profils')
      
      this.profils = []
      this.currentProfil = null
      this.loading = false
      this.error = ''
      
      // Effacer le cookie
      const selectedProfilCookie = useCookie('selectedProfil')
      selectedProfilCookie.value = null
    },

    // Effacer les erreurs
    clearError() {
      this.error = ''
    }
  }
}) 