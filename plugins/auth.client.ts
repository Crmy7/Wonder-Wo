export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification au chargement de l'app
  // uniquement côté client pour éviter les problèmes de SSR
  if (process.client) {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.log('Vérification auth échouée:', error)
    }
  }
}) 