export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification seulement côté client
  if (process.client) {
    // Vérifier si l'utilisateur est connecté
    await authStore.checkAuth()
    
    if (!authStore.isLoggedIn) {
      // Rediriger vers la page de connexion
      return navigateTo('/login')
    }
  }
}) 