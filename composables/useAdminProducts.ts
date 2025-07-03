export interface AdminProduct {
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
  createdAt: string | Date
  updatedAt: string | Date
}

export interface AdminProductsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminProductsResponse {
  success: boolean
  produits: AdminProduct[]
  pagination: AdminProductsPagination
  message?: string
}

export const useAdminProducts = () => {
  const products = ref<AdminProduct[]>([])
  const loading = ref(false)
  const error = ref('')
  const pagination = ref<AdminProductsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Charger la liste des produits
  const loadProducts = async (page: number = 1, search: string = '') => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔄 Chargement des produits admin - page:', page, 'search:', search)
      
      const data = await $fetch<AdminProductsResponse>('/api/admin/products/list', {
        query: { page, limit: 20, search }
      })
      
      products.value = data.produits
      pagination.value = data.pagination
      
      console.log('✅ Produits chargés:', products.value.length)
      return data
      
    } catch (err: any) {
      console.error('❌ Erreur chargement produits admin:', err)
      error.value = err.statusMessage || 'Erreur lors du chargement des produits'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour un produit
  const updateProduct = async (productId: number, productData: Partial<AdminProduct>) => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔄 Mise à jour du produit:', productId)
      
      const data = await $fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        body: productData
      })
      
      // Mettre à jour le produit dans la liste locale
      const productIndex = products.value.findIndex(p => p.id === productId)
      if (productIndex !== -1) {
        products.value[productIndex] = { ...products.value[productIndex], ...data.produit }
      }
      
      console.log('✅ Produit mis à jour')
      return data
      
    } catch (err: any) {
      console.error('❌ Erreur mise à jour produit:', err)
      error.value = err.statusMessage || 'Erreur lors de la mise à jour du produit'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Rechercher des produits
  const searchProducts = async (searchTerm: string) => {
    return await loadProducts(1, searchTerm)
  }

  // Charger une page spécifique
  const loadPage = async (page: number) => {
    return await loadProducts(page)
  }

  // Obtenir un produit par ID
  const getProductById = (productId: number): AdminProduct | undefined => {
    return products.value.find(p => p.id === productId)
  }

  // Fonctions utilitaires pour les formes galéniques
  const getFormeGaleniqueLabel = (forme: number): string => {
    const formes = {
      1: 'Tisane/Infusion',
      2: 'Miel/Sirop',
      3: 'Huile essentielle',
      4: 'Gélules/Comprimés',
      5: 'Poudre',
      6: 'Extrait liquide',
      7: 'Crème/Baume',
      8: 'Autre'
    }
    return formes[forme as keyof typeof formes] || 'Non spécifié'
  }

  const getFormeGaleniqueOptions = () => [
    { value: 1, label: 'Tisane/Infusion' },
    { value: 2, label: 'Miel/Sirop' },
    { value: 3, label: 'Huile essentielle' },
    { value: 4, label: 'Gélules/Comprimés' },
    { value: 5, label: 'Poudre' },
    { value: 6, label: 'Extrait liquide' },
    { value: 7, label: 'Crème/Baume' },
    { value: 8, label: 'Autre' }
  ]

  // Obtenir le nombre total de produits
  const getTotalProducts = computed(() => pagination.value.total)

  // Obtenir le nombre total de pages
  const getTotalPages = computed(() => pagination.value.totalPages)

  // Vérifier si on peut charger la page suivante
  const hasNextPage = computed(() => pagination.value.page < pagination.value.totalPages)

  // Vérifier si on peut charger la page précédente
  const hasPreviousPage = computed(() => pagination.value.page > 1)

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  return {
    // État réactif
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    
    // Computed
    getTotalProducts,
    getTotalPages,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    loadProducts,
    updateProduct,
    searchProducts,
    loadPage,
    getProductById,
    clearError,
    
    // Utilitaires
    getFormeGaleniqueLabel,
    getFormeGaleniqueOptions
  }
} 