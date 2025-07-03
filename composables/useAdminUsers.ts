export interface AdminUser {
  id: number
  email: string
  role: 'user' | 'admin'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface AdminUsersPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminUsersResponse {
  success: boolean
  users: AdminUser[]
  pagination: AdminUsersPagination
  message?: string
}

export const useAdminUsers = () => {
  const users = ref<AdminUser[]>([])
  const loading = ref(false)
  const error = ref('')
  const pagination = ref<AdminUsersPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Charger la liste des utilisateurs
  const loadUsers = async (page: number = 1, search: string = '') => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔄 Chargement des utilisateurs admin - page:', page, 'search:', search)
      
      const data = await $fetch<AdminUsersResponse>('/api/admin/users/list', {
        query: { page, limit: 20, search }
      })
      
      users.value = data.users
      pagination.value = data.pagination
      
      console.log('✅ Utilisateurs chargés:', users.value.length)
      return data
      
    } catch (err: any) {
      console.error('❌ Erreur chargement utilisateurs admin:', err)
      error.value = err.statusMessage || 'Erreur lors du chargement des utilisateurs'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = async (userId: number, role: 'user' | 'admin') => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('🔄 Mise à jour du rôle utilisateur:', userId, 'vers', role)
      
      const data = await $fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role }
      })
      
      // Mettre à jour l'utilisateur dans la liste locale
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].role = role
        users.value[userIndex].updatedAt = new Date()
      }
      
      console.log('✅ Rôle utilisateur mis à jour')
      return data
      
    } catch (err: any) {
      console.error('❌ Erreur mise à jour rôle utilisateur:', err)
      error.value = err.statusMessage || 'Erreur lors de la mise à jour du rôle'
      throw err
      
    } finally {
      loading.value = false
    }
  }

  // Rechercher des utilisateurs
  const searchUsers = async (searchTerm: string) => {
    return await loadUsers(1, searchTerm)
  }

  // Charger une page spécifique
  const loadPage = async (page: number) => {
    return await loadUsers(page)
  }

  // Obtenir le nombre total d'utilisateurs
  const getTotalUsers = computed(() => pagination.value.total)

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
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    
    // Computed
    getTotalUsers,
    getTotalPages,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    loadUsers,
    updateUserRole,
    searchUsers,
    loadPage,
    clearError
  }
} 