<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Recherche</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()
const { 
  profils, 
  currentProfil, 
  hasProfiles, 
  profilCount,
  error,
  loading,
  selectProfil: selectProfilStore,
  createProfil: createProfilStore,
  deleteProfil: deleteProfilStore,
  clearError,
  initProfils,
  resetStore 
} = useProfils()

const useProfilActions = () => {
  const logout = async () => {
    try {
      await authStore.logout()
      resetStore()
      await navigateTo('/')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  return {
    logout
  }
}

const { 
  logout: handleLogout 
} = useProfilActions()

// Initialisation
onMounted(async () => {
  // Vérifier l'authentification
  await authStore.checkAuth()
  if (!authStore.isLoggedIn) {
    await navigateTo('/login')
    return
  }
  
  // Charger les profils
  await initProfils()
})
</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
</style> 