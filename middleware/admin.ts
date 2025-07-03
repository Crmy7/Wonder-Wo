export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Charger les infos utilisateur si pas encore fait
  if (!authStore.user) {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.error('🔧 [ADMIN] Erreur checkAuth:', error)
    }
  }
  
  // Si pas connecté, rediriger vers login avec la route complète
  if (!authStore.isLoggedIn) {
    console.log('🔧 [ADMIN] Redirection vers login, route demandée:', to.fullPath)
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
  
  // Si connecté mais pas admin, erreur 403
  if (!authStore.isAdmin) {
    console.log('🔧 [ADMIN] Accès refusé - utilisateur non admin')
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès administrateur requis'
    })
  }
  
  console.log('🔧 [ADMIN] Accès autorisé à:', to.fullPath)
}) 