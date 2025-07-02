// composables/useMaux.ts
import type { ResultatRecherche, RechercheResponse, PlacardInfo, ProfilUtilisateur } from '~/types/maux'

export const useMaux = () => {
  const resultats = ref<ResultatRecherche[]>([])
  const placardInfo = ref<PlacardInfo | null>(null)
  const loading = ref(false)
  const error = ref('')
  const searched = ref(false)
  const lastSearchTerm = ref('')

  // Rechercher des remèdes pour un symptôme
  const rechercherRemedes = async (symptome: string, profil?: ProfilUtilisateur) => {
    if (!symptome.trim()) {
      throw new Error('Symptôme requis')
    }

    console.log('🔍 [COMPOSABLE] Début recherche pour:', symptome, 'avec profil:', profil)
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔍 [COMPOSABLE] Appel API /api/maux/search')
      
      const data = await $fetch<RechercheResponse>('/api/maux/search', {
        method: 'POST',
        body: { symptome, profil }
      })
      
      console.log('✅ [COMPOSABLE] Réponse API reçue:', {
        success: data.success,
        count: data.count,
        resultatsLength: data.resultats?.length
      })
      
      resultats.value = data.resultats || []
      placardInfo.value = data.placardInfo || {
        totalProduits: 0,
        recettesAvecPlacard: 0,
        recettesSansPlacard: 0
      }
      
      searched.value = true
      lastSearchTerm.value = symptome
      
      console.log('✅ [COMPOSABLE] Traitement terminé - remèdes trouvés:', resultats.value.length)
      console.log('📦 [COMPOSABLE] PlacardInfo:', placardInfo.value)
      return data
      
    } catch (err: any) {
      console.error('❌ [COMPOSABLE] Erreur recherche remèdes:', err)
      console.error('❌ [COMPOSABLE] Details:', {
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
        message: err.message,
        data: err.data
      })
      error.value = err.statusMessage || err.message || 'Erreur lors de la recherche'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Recherche avec gestion automatique du profil actuel
  const rechercherAvecProfilActuel = async (symptome: string) => {
    const { currentProfil } = useProfils()
    
    const profilData = currentProfil.value ? {
      id: currentProfil.value.id,
      nom: currentProfil.value.nom,
      age: currentProfil.value.age,
      grossesse: currentProfil.value.grossesse,
      enfants: currentProfil.value.enfants
    } : undefined
    
    return await rechercherRemedes(symptome, profilData)
  }

  // Obtenir les remèdes qui utilisent des produits du placard
  const getRemedesTout = computed(() => resultats.value)
  
  const getRemediesAvecPlacard = computed(() => 
    resultats.value.filter(r => r.produitsPlacardDisponibles > 0)
  )
  
  const getRemediesSansPlacard = computed(() => 
    resultats.value.filter(r => r.produitsPlacardDisponibles === 0)
  )

  // Obtenir les remèdes adaptés au profil
  const getRemediesAdaptes = computed(() =>
    resultats.value.filter(r => r.adapteAuProfil)
  )

  const getRemediesNonAdaptes = computed(() =>
    resultats.value.filter(r => !r.adapteAuProfil)
  )

  // Trier les remèdes par score de priorité
  const getRemediesTries = computed(() => {
    return [...resultats.value].sort((a, b) => {
      // Priorité 1: Produits placard disponibles
      if (b.produitsPlacardDisponibles !== a.produitsPlacardDisponibles) {
        return b.produitsPlacardDisponibles - a.produitsPlacardDisponibles
      }
      // Priorité 2: Adaptation au profil
      if (b.adapteAuProfil !== a.adapteAuProfil) {
        return b.adapteAuProfil ? 1 : -1
      }
      // Priorité 3: Score général
      return b.score - a.score
    })
  })

  // Réinitialiser la recherche
  const resetRecherche = () => {
    resultats.value = []
    placardInfo.value = null
    searched.value = false
    lastSearchTerm.value = ''
    error.value = ''
  }

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  // Getters computés
  const hasResults = computed(() => resultats.value.length > 0)
  const totalRemedes = computed(() => resultats.value.length)
  const remedesAvecPlacardCount = computed(() => 
    resultats.value.filter(r => r.produitsPlacardDisponibles > 0).length
  )

  // Actions sur les remèdes
  const ajouterProduitAuPlacard = async (produitId: number) => {
    const { addToPlacard } = usePlacard()
    try {
      await addToPlacard(produitId)
      // Relancer la recherche pour mettre à jour les statuts placard
      if (lastSearchTerm.value) {
        await rechercherAvecProfilActuel(lastSearchTerm.value)
      }
    } catch (error) {
      console.error('Erreur ajout au placard:', error)
      throw error
    }
  }

  const ajouterTousProduitsAuPlacard = async (remede: ResultatRecherche) => {
    const { addToPlacard } = usePlacard()
    try {
      const produitsAAjouter = remede.produits.filter(p => !p.dansPlacard)
      
      for (const produit of produitsAAjouter) {
        await addToPlacard(produit.id)
      }
      
      // Relancer la recherche pour mettre à jour les statuts
      if (lastSearchTerm.value) {
        await rechercherAvecProfilActuel(lastSearchTerm.value)
      }
      
      return {
        success: true,
        message: `${produitsAAjouter.length} produit(s) ajouté(s) au placard`
      }
    } catch (error) {
      console.error('Erreur ajout multiple au placard:', error)
      throw error
    }
  }

  // Suggestions de symptômes populaires
  const symptomesPopulaires = [
    'mal de tête',
    'stress',
    'insomnie',
    'rhume',
    'digestion difficile',
    'fatigue',
    'anxiété',
    'mal de gorge',
    'douleurs musculaires',
    'brûlures d\'estomac'
  ]

  // Filtrer les résultats par catégorie
  const filtrerParCategorie = (categorie: string) => {
    return resultats.value.filter(r => r.categorie === categorie)
  }

  // Obtenir les catégories disponibles
  const categoriesDisponibles = computed(() => {
    const categories = new Set(resultats.value.map(r => r.categorie))
    return Array.from(categories)
  })

  return {
    // État réactif
    resultats: readonly(resultats),
    placardInfo: readonly(placardInfo),
    loading: readonly(loading),
    error: readonly(error),
    searched: readonly(searched),
    lastSearchTerm: readonly(lastSearchTerm),
    
    // Getters computés
    hasResults,
    totalRemedes,
    remedesAvecPlacardCount,
    getRemedesTout,
    getRemediesAvecPlacard,
    getRemediesSansPlacard,
    getRemediesAdaptes,
    getRemediesNonAdaptes,
    getRemediesTries,
    categoriesDisponibles,
    
    // Actions
    rechercherRemedes,
    rechercherAvecProfilActuel,
    resetRecherche,
    clearError,
    ajouterProduitAuPlacard,
    ajouterTousProduitsAuPlacard,
    filtrerParCategorie,
    
    // Constantes
    symptomesPopulaires
  }
}