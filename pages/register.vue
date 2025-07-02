<template>
  <div class="min-h-screen bg-blanc flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Création de compte</h2>
        <p class="accent-text mb-6">Vous allez être redirigé vers notre processus guidé</p>
        
        <div class="bg-primary/10 p-6 rounded-2xl border border-primary/20 mb-6">
          <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p class="text-grey-black/80">Redirection en cours...</p>
        </div>
        
        <div class="text-center">
          <p class="text-grey-black">
            Déjà un compte ?
            <NuxtLink to="/login" class="font-medium accent-text-primary hover:text-primary transition-colors">
              Se connecter
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false
})

const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()

// Redirection immédiate vers l'onboarding guidé
onMounted(async () => {
  // Vérifier si déjà connecté
  await authStore.checkAuth()
  if (authStore.isLoggedIn) {
    await navigateTo('/profil')
    return
  }
  
  // Sinon rediriger vers l'accueil et déclencher onboarding guidé
  setTimeout(() => {
    navigateTo('/')
  }, 1500)
})
</script> 