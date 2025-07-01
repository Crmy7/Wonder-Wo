export const useDebugAuth = () => {
  const authStore = useAuthStore()

  // Test de connexion directe à l'API
  const testDirectLogin = async (email: string = 'test@test.ch', password: string = 'password') => {
    console.log('🧪 DEBUG - Test de connexion directe à l\'API')
    
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      console.log('✅ DEBUG - Réponse API directe:', response)
      return response
    } catch (error) {
      console.error('❌ DEBUG - Erreur API directe:', error)
      throw error
    }
  }

  // Test de vérification d'auth
  const testCheckAuth = async () => {
    console.log('🧪 DEBUG - Test de vérification d\'auth')
    
    try {
      const response = await $fetch('/api/auth/me')
      console.log('✅ DEBUG - Réponse checkAuth:', response)
      return response
    } catch (error) {
      console.error('❌ DEBUG - Erreur checkAuth:', error)
      throw error
    }
  }

  // Test complet avec le store
  const testStoreLogin = async (email: string = 'test@test.ch', password: string = 'password') => {
    console.log('🧪 DEBUG - Test de connexion via store')
    
    try {
      const result = await authStore.login(email, password)
      console.log('✅ DEBUG - Résultat store login:', result)
      console.log('📊 DEBUG - État du store:', {
        isLoggedIn: authStore.isLoggedIn,
        user: authStore.user,
        error: authStore.error,
        loading: authStore.loading
      })
      return result
    } catch (error) {
      console.error('❌ DEBUG - Erreur store login:', error)
      console.log('📊 DEBUG - État du store après erreur:', {
        isLoggedIn: authStore.isLoggedIn,
        user: authStore.user,
        error: authStore.error,
        loading: authStore.loading
      })
      throw error
    }
  }

  // Afficher l'état actuel
  const showCurrentState = () => {
    console.log('📊 DEBUG - État actuel du store d\'auth:', {
      isLoggedIn: authStore.isLoggedIn,
      user: authStore.user,
      error: authStore.error,
      loading: authStore.loading
    })
  }

  // Test de tous les endpoints
  const testAllEndpoints = async () => {
    console.log('🧪 DEBUG - Test de tous les endpoints d\'auth')
    
    const results = {
      checkAuth: null as any,
      directLogin: null as any,
      storeLogin: null as any
    }

    // 1. Test checkAuth
    try {
      results.checkAuth = await testCheckAuth()
    } catch (e) {
      results.checkAuth = { error: e }
    }

    // 2. Test login direct
    try {
      results.directLogin = await testDirectLogin()
    } catch (e) {
      results.directLogin = { error: e }
    }

    // 3. Test store login
    try {
      results.storeLogin = await testStoreLogin()
    } catch (e) {
      results.storeLogin = { error: e }
    }

    console.log('📋 DEBUG - Résultats de tous les tests:', results)
    return results
  }

  return {
    testDirectLogin,
    testCheckAuth,
    testStoreLogin,
    showCurrentState,
    testAllEndpoints
  }
} 