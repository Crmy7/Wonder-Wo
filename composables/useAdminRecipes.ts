interface Recipe {
  id: number
  type_remede: number
  type_application: number
  recette: string
  tranche_age: number
  femme_enceinte: boolean
  source_documentaire: string
  efficacite: number | null
  produits: Array<{ id: number; Nom_Commun: string }>
  maux: Array<{ id: number; Symptom: string }>
  created_at: string
  updated_at: string
}

interface RecipeResponse {
  recipes: Recipe[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface UpdateRecipeResponse {
  success: boolean
  recipe: Recipe
}

export const useAdminRecipes = () => {
  // État réactif
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref('')
  const searchTerm = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalRecipes = ref(0)
  const totalPages = ref(0)

  // Charger les recettes
  const loadRecipes = async (page = 1, search = '') => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('📋 [ADMIN RECIPES] Chargement des recettes - page:', page, 'search:', search)
      
      const response = await $fetch<RecipeResponse>('/api/admin/recipes/list', {
        query: {
          page,
          limit: itemsPerPage.value,
          search
        }
      })
      
      console.log('📋 [ADMIN RECIPES] Recettes chargées:', response)
      
      recipes.value = response.recipes
      currentPage.value = response.pagination.page
      totalRecipes.value = response.pagination.total
      totalPages.value = response.pagination.totalPages
      
      return response
      
    } catch (err: any) {
      console.error('❌ [ADMIN RECIPES] Erreur chargement:', err)
      error.value = err.statusMessage || 'Erreur lors du chargement des recettes'
      recipes.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Rechercher des recettes
  const searchRecipes = async (term: string) => {
    searchTerm.value = term
    currentPage.value = 1
    await loadRecipes(1, term)
  }

  // Aller à une page spécifique
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      await loadRecipes(page, searchTerm.value)
    }
  }

  // Modifier une recette
  const updateRecipe = async (id: number, data: Partial<Recipe>) => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('📋 [ADMIN RECIPES] Modification recette ID:', id, 'données:', data)
      
      const response = await $fetch<UpdateRecipeResponse>(`/api/admin/recipes/${id}`, {
        method: 'PATCH',
        body: data
      })
      
      console.log('📋 [ADMIN RECIPES] Recette modifiée:', response)
      
      // Mettre à jour la recette dans la liste locale
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = response.recipe
      }
      
      return response
      
    } catch (err: any) {
      console.error('❌ [ADMIN RECIPES] Erreur modification:', err)
      error.value = err.statusMessage || 'Erreur lors de la modification de la recette'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Rafraîchir les données
  const refresh = async () => {
    await loadRecipes(currentPage.value, searchTerm.value)
  }

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  // Computed pour les statistiques
  const stats = computed(() => ({
    total: totalRecipes.value,
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    showing: recipes.value.length
  }))

  // Types/catégories pour les formulaires
  const typeRemedOptions = [
    { value: 1, label: 'Infusion' },
    { value: 2, label: 'Décoction' },
    { value: 3, label: 'Cataplasme' },
    { value: 4, label: 'Huile essentielle' },
    { value: 5, label: 'Teinture' },
    { value: 6, label: 'Autre' }
  ]

  const typeApplicationOptions = [
    { value: 1, label: 'Voie orale' },
    { value: 2, label: 'Application cutanée' },
    { value: 3, label: 'Inhalation' },
    { value: 4, label: 'Bain' },
    { value: 5, label: 'Gargarisme' },
    { value: 6, label: 'Autre' }
  ]

  const trancheAgeOptions = [
    { value: 1, label: '0-2 ans' },
    { value: 2, label: '3-12 ans' },
    { value: 3, label: '13-17 ans' },
    { value: 4, label: '18-65 ans' },
    { value: 5, label: '65+ ans' },
    { value: 6, label: 'Tous âges' }
  ]

  // Helpers pour l'affichage
  const getTypeRemedLabel = (value: number) => {
    return typeRemedOptions.find(opt => opt.value === value)?.label || 'Inconnu'
  }

  const getTypeApplicationLabel = (value: number) => {
    return typeApplicationOptions.find(opt => opt.value === value)?.label || 'Inconnu'
  }

  const getTrancheAgeLabel = (value: number) => {
    return trancheAgeOptions.find(opt => opt.value === value)?.label || 'Inconnu'
  }

  return {
    // État
    recipes: readonly(recipes),
    loading: readonly(loading),
    error: readonly(error),
    searchTerm: readonly(searchTerm),
    currentPage: readonly(currentPage),
    totalRecipes: readonly(totalRecipes),
    totalPages: readonly(totalPages),
    stats,
    
    // Actions
    loadRecipes,
    searchRecipes,
    goToPage,
    updateRecipe,
    refresh,
    clearError,
    
    // Options pour les formulaires
    typeRemedOptions,
    typeApplicationOptions,
    trancheAgeOptions,
    
    // Helpers
    getTypeRemedLabel,
    getTypeApplicationLabel,
    getTrancheAgeLabel
  }
} 