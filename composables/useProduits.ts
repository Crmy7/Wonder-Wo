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

export const useProduits = () => {
  const produits = ref<Produit[]>([])
  const loading = ref(false)
  const error = ref('')

  // Charger tous les produits
  const loadProduits = async () => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔄 Chargement des produits...')
      const data = await $fetch('/api/produits/list')
      produits.value = data.produits || []
      
      console.log('✅ Produits chargés:', produits.value.length)
      return { success: true, produits: produits.value }
      
    } catch (err: any) {
      console.error('❌ Erreur chargement produits:', err)
      error.value = err.statusMessage || 'Erreur lors du chargement des produits'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Rechercher des produits
  const searchProduits = (query: string) => {
    if (!query.trim()) return produits.value
    
    const searchTerm = query.toLowerCase()
    return produits.value.filter(produit => 
      produit.nom.toLowerCase().includes(searchTerm) ||
      produit.nomScientifique.toLowerCase().includes(searchTerm) ||
      produit.proprietesPrincipales.toLowerCase().includes(searchTerm) ||
      produit.proprietesSecondaires.toLowerCase().includes(searchTerm)
    )
  }

  // Filtrer par propriétés
  const filterByProprietes = (proprietes: string[]) => {
    if (!proprietes.length) return produits.value
    
    return produits.value.filter(produit => 
      proprietes.some(prop => 
        produit.proprietesPrincipales.toLowerCase().includes(prop.toLowerCase()) ||
        produit.proprietesSecondaires.toLowerCase().includes(prop.toLowerCase())
      )
    )
  }

  // Obtenir les tags de propriétés d'un produit
  const getProduitsProps = (produit: Produit): string[] => {
    const props = []
    
    // Diviser les propriétés principales et secondaires
    const principales = produit.proprietesPrincipales.split(',').map(p => p.trim())
    const secondaires = produit.proprietesSecondaires.split(',').map(p => p.trim())
    
    props.push(...principales.slice(0, 2)) // Prendre les 2 premières principales
    if (props.length < 3) {
      props.push(...secondaires.slice(0, 3 - props.length)) // Compléter avec secondaires
    }
    
    return props.filter(p => p.length > 0)
  }

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  return {
    // État réactif
    produits: readonly(produits),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    loadProduits,
    searchProduits,
    filterByProprietes,
    getProduitsProps,
    clearError
  }
}