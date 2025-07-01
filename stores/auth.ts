export const useAuthStore = defineStore('auth', () => {
  // État de l'utilisateur
  const user = ref<{ id: number; email: string } | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const loading = ref(false)
  const error = ref('')

  // Connexion
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      // Le cookie est défini automatiquement par le serveur
      user.value = data.user
      
      return {
        success: true,
        message: data.message
      }
    } catch (err: any) {
      error.value = err.statusMessage || err.message || 'Erreur lors de la connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const register = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password }
      })
      
      // Le cookie est défini automatiquement par le serveur
      user.value = data.user
      
      return {
        success: true,
        message: data.message
      }
    } catch (err: any) {
      error.value = err.statusMessage || err.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = async () => {
    loading.value = true
    
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      // Effacer l'état local
      user.value = null
      error.value = ''
      
      return {
        success: true,
        message: 'Déconnexion réussie'
      }
    } catch (err: any) {
      console.error('Erreur déconnexion:', err)
      // Même si l'API échoue, on efface l'état local
      user.value = null
      error.value = ''
    } finally {
      loading.value = false
    }
  }

  // Vérifier l'authentification au chargement
  const checkAuth = async () => {
    // On vérifie si l'utilisateur est connecté côté serveur
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.user
    } catch (err) {
      // Si erreur, l'utilisateur n'est pas connecté
      user.value = null
    }
  }

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  return {
    // État
    user: readonly(user),
    isLoggedIn,
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError
  }
}) 