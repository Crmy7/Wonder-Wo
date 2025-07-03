// Types
interface User {
  id: number
  email: string
  role?: string
}

interface AuthResponse {
  success: boolean
  user: User
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  // État de l'utilisateur
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const loading = ref(false)
  const error = ref('')

  // Connexion
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    
    console.log('🔍 Store login - Début de la connexion pour:', email)
    
    try {
      console.log('📡 Store login - Envoi de la requête à /api/auth/login')
      
      const data = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      console.log('📥 Store login - Réponse reçue:', data)
      
      // Vérifier si la réponse indique un succès
      if (data.success && data.user) {
        console.log('✅ Store login - Connexion réussie, mise à jour de l\'état utilisateur')
        // Le cookie est défini automatiquement par le serveur
        user.value = data.user
        
        return {
          success: true,
          message: data.message
        }
      } else {
        console.error('❌ Store login - Réponse inattendue:', { success: data.success, hasUser: !!data.user })
        // Réponse inattendue
        error.value = 'Réponse inattendue du serveur'
        throw new Error('Réponse inattendue du serveur')
      }
    } catch (err: any) {
      console.error('🚨 Store login - Erreur capturée:', {
        message: err.message,
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
        data: err.data,
        fullError: err
      })
      
      // Si c'est une erreur de réseau ou serveur
      if (err.statusCode) {
        error.value = err.statusMessage || err.message || 'Erreur lors de la connexion'
      } else {
        error.value = err.message || 'Erreur de connexion au serveur'
      }
      
      throw err
    } finally {
      loading.value = false
      console.log('🏁 Store login - Fin du processus de connexion')
    }
  }

  // Inscription
  const register = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    
    try {
      const data = await $fetch<AuthResponse>('/api/auth/register', {
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
      
      // Reset du store profils si disponible
      try {
        const profilStore = useProfilStore()
        profilStore.resetStore()
      } catch (e) {
        // Le store profils n'est peut-être pas encore initialisé
        console.log('Store profils non disponible lors de la déconnexion')
      }
      
      return {
        success: true,
        message: 'Déconnexion réussie'
      }
    } catch (err: any) {
      console.error('Erreur déconnexion:', err)
      // Même si l'API échoue, on efface l'état local
      user.value = null
      error.value = ''
      
      // Reset du store profils même en cas d'erreur
      try {
        const profilStore = useProfilStore()
        profilStore.resetStore()
      } catch (e) {
        console.log('Store profils non disponible lors de la déconnexion')
      }
    } finally {
      loading.value = false
    }
  }

  // Vérifier l'authentification au chargement
  const checkAuth = async () => {
    // On vérifie si l'utilisateur est connecté côté serveur
    try {
      const data = await $fetch<AuthResponse>('/api/auth/me')
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
    isAdmin,
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