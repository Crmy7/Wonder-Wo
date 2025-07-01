// composables/usePlacard.ts

export interface PlacardItem {
    id: number
    produit: string
    IdProduit: number
    createdAt: string
    details?: {
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
      inPlacard?: boolean
    }
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
  
  export const usePlacard = () => {
    const items = ref<PlacardItem[]>([])
    const loading = ref(false)
    const error = ref('')
  
    // Charger tous les produits du placard
    const loadPlacard = async () => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('🔄 Chargement du placard...')
        const data = await $fetch<PlacardResponse>('/api/placard/list')
        items.value = data.items || []
        
        console.log('✅ Placard chargé:', items.value.length, 'produits')
        return { success: true, items: items.value }
        
      } catch (err: any) {
        console.error('❌ Erreur chargement placard:', err)
        error.value = err.statusMessage || 'Erreur lors du chargement du placard'
        throw err
        
      } finally {
        loading.value = false
      }
    }
  
    // Ajouter un produit au placard
    const addToPlacard = async (produitId: number) => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('➕ Ajout du produit au placard:', produitId)
        
        const data = await $fetch<PlacardResponse>('/api/placard/add', {
          method: 'POST',
          body: { IdProduit: produitId }
        })
        
        // Recharger le placard
        await loadPlacard()
        
        console.log('✅ Produit ajouté au placard')
        return { success: true, message: data.message }
        
      } catch (err: any) {
        console.error('❌ Erreur ajout placard:', err)
        error.value = err.statusMessage || 'Erreur lors de l\'ajout au placard'
        throw err
        
      } finally {
        loading.value = false
      }
    }
  
    // Retirer un produit du placard par ID de l'item
    const removeFromPlacardById = async (itemId: number) => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('🗑️ Suppression de l\'item du placard:', itemId)
        
        const data = await $fetch<PlacardResponse>(`/api/placard/${itemId}`, {
          method: 'DELETE'
        })
        
        // Recharger le placard
        await loadPlacard()
        
        console.log('✅ Item retiré du placard')
        return { success: true, message: data.message }
        
      } catch (err: any) {
        console.error('❌ Erreur suppression placard:', err)
        error.value = err.statusMessage || 'Erreur lors de la suppression'
        throw err
        
      } finally {
        loading.value = false
      }
    }
  
    // Retirer un produit du placard par ID du produit
    const removeFromPlacardByProductId = async (produitId: number) => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('🗑️ Suppression du produit du placard:', produitId)
        
        const data = await $fetch<PlacardResponse>(`/api/placard/remove/${produitId}`, {
          method: 'DELETE'
        })
        
        // Recharger le placard
        await loadPlacard()
        
        console.log('✅ Produit retiré du placard')
        return { success: true, message: data.message }
        
      } catch (err: any) {
        console.error('❌ Erreur suppression placard:', err)
        error.value = err.statusMessage || 'Erreur lors de la suppression'
        throw err
        
      } finally {
        loading.value = false
      }
    }
  
    // Vérifier si un produit est dans le placard
    const checkInPlacard = async (produitId: number) => {
      try {
        const data = await $fetch<PlacardResponse>(`/api/placard/check/${produitId}`)
        return data.inPlacard || false
      } catch (err) {
        console.error('❌ Erreur vérification placard:', err)
        return false
      }
    }
  
    // Vider complètement le placard
    const clearPlacard = async () => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('🧹 Vidage complet du placard')
        
        const data = await $fetch<PlacardResponse>('/api/placard/clear', {
          method: 'DELETE'
        })
        
        // Vider la liste locale
        items.value = []
        
        console.log('✅ Placard vidé:', data.deletedCount, 'produits supprimés')
        return { success: true, message: data.message, deletedCount: data.deletedCount }
        
      } catch (err: any) {
        console.error('❌ Erreur vidage placard:', err)
        error.value = err.statusMessage || 'Erreur lors du vidage du placard'
        throw err
        
      } finally {
        loading.value = false
      }
    }
  
    // Vérifier si un produit est déjà dans le placard (local)
    const isInPlacard = (produitId: number): boolean => {
      return items.value.some(item => item.IdProduit === produitId)
    }
  
    // Obtenir un item du placard par ID produit
    const getPlacardItemByProductId = (produitId: number): PlacardItem | undefined => {
      return items.value.find(item => item.IdProduit === produitId)
    }
  
    // Effacer les erreurs
    const clearError = () => {
      error.value = ''
    }
  
    // Getters computés
    const placardCount = computed(() => items.value.length)
    const isEmpty = computed(() => items.value.length === 0)
    const hasItems = computed(() => items.value.length > 0)
  
    return {
      // État réactif
      items: readonly(items),
      loading: readonly(loading),
      error: readonly(error),
      
      // Getters computés
      placardCount,
      isEmpty,
      hasItems,
      
      // Actions
      loadPlacard,
      addToPlacard,
      removeFromPlacardById,
      removeFromPlacardByProductId,
      checkInPlacard,
      clearPlacard,
      clearError,
      
      // Utilitaires
      isInPlacard,
      getPlacardItemByProductId
    }
  }