// composables/useMaux.ts
import type { ResultatRecherche, RechercheResponse, PlacardInfo, ProfilUtilisateur, MauxPopulairesResponse, SuggestionMal, SuggestionsResponse } from '~/types/maux'

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
      
      // Afficher le JSON complet de la réponse
      console.log('📋 [COMPOSABLE] RÉPONSE API COMPLÈTE:', JSON.stringify(data, null, 2))
      
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
      
      // Afficher le JSON détaillé des résultats
      if (resultats.value.length > 0) {
        console.log('📋 [COMPOSABLE] RÉSULTATS DÉTAILLÉS:')
        resultats.value.forEach((resultat, index) => {
          console.log(`--- RÉSULTAT ${index + 1} ---`)
          console.log(JSON.stringify(resultat, null, 2))
        })
      } else {
        console.log('⚠️ [COMPOSABLE] Aucun résultat trouvé')
      }
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
  const symptomesPopulaires = ref<string[]>([])
  const symptomesLoading = ref(false)
  
  // Suggestions d'autocomplétion
  const suggestions = ref<SuggestionMal[]>([])
  const suggestionsLoading = ref(false)
  const suggestionsVisible = ref(false)
  
  // Charger les symptômes populaires depuis la base de données
  const chargerSymptomesPopulaires = async (useOptimized = false) => {
    if (symptomesPopulaires.value.length > 0) {
      return // Déjà chargés
    }
    
    symptomesLoading.value = true
    
    try {
      console.log('🔍 [COMPOSABLE] Chargement des symptômes populaires', useOptimized ? '(version optimisée)' : '')
      
      const endpoint = useOptimized ? '/api/maux/populaires-optimise' : '/api/maux/populaires'
      const data = await $fetch<MauxPopulairesResponse>(endpoint)
      
      symptomesPopulaires.value = data.symptomes || []
      
      console.log('✅ [COMPOSABLE] Symptômes populaires chargés:', {
        count: data.count,
        fromDatabase: data.fromDatabase,
        premiers: data.symptomes.slice(0, 3)
      })
      
      if (data.error) {
        console.warn('⚠️ [COMPOSABLE] Avertissement:', data.error)
      }
      
    } catch (err: any) {
      console.error('❌ [COMPOSABLE] Erreur chargement symptômes populaires:', err)
      
      // Si c'est la première tentative, essayer la version optimisée
      if (!useOptimized && err.statusCode === 500) {
        console.log('🔄 [COMPOSABLE] Tentative avec API optimisée')
        try {
          await chargerSymptomesPopulaires(true)
          return // Succès avec la version optimisée
        } catch (err2: any) {
          console.error('❌ [COMPOSABLE] Erreur même avec API optimisée:', err2)
        }
      }
      
      // Fallback vers des exemples par défaut
      symptomesPopulaires.value = [
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
    } finally {
      symptomesLoading.value = false
    }
  }

  // Rechercher des suggestions d'autocomplétion
  const rechercherSuggestions = async (terme: string) => {
    if (!terme.trim() || terme.trim().length < 2) {
      suggestions.value = []
      suggestionsVisible.value = false
      return
    }

    suggestionsLoading.value = true
    
    try {
      console.log('🔍 [SUGGESTIONS] Recherche pour:', terme)
      
      const data = await $fetch<SuggestionsResponse>('/api/maux/suggestions', {
        query: { q: terme }
      })
      
      suggestions.value = data.suggestions || []
      suggestionsVisible.value = true
      
      console.log('✅ [SUGGESTIONS] Trouvées:', data.count)
      
    } catch (err: any) {
      console.error('❌ [SUGGESTIONS] Erreur:', err)
      suggestions.value = []
      suggestionsVisible.value = false
    } finally {
      suggestionsLoading.value = false
    }
  }

  // Masquer les suggestions
  const masquerSuggestions = () => {
    suggestionsVisible.value = false
  }

  // Sélectionner une suggestion
  const selectionnerSuggestion = (suggestion: SuggestionMal) => {
    suggestionsVisible.value = false
    return suggestion.symptom
  }

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
    chargerSymptomesPopulaires,
    
    // Données réactives des symptômes populaires
    symptomesPopulaires: readonly(symptomesPopulaires),
    symptomesLoading: readonly(symptomesLoading),
    
    // Suggestions d'autocomplétion
    suggestions: readonly(suggestions),
    suggestionsLoading: readonly(suggestionsLoading),
    suggestionsVisible: readonly(suggestionsVisible),
    rechercherSuggestions,
    masquerSuggestions,
    selectionnerSuggestion
  }
}