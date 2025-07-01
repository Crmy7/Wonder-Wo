<template>
  <div class="min-h-screen bg-blanc flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Se connecter</h2>
        <p class="accent-text">Accédez à vos remèdes naturels personnalisés</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="bg-blanc p-8 rounded-2xl border border-beige shadow-sm">
          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium mb-2">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="votre@email.com"
            />
          </div>
          
          <!-- Password -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Votre mot de passe"
            />
          </div>
          
          <!-- Error Message -->
          <div v-if="authStore.error" class="mb-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
            <p class="text-secondary text-sm font-medium">{{ authStore.error }}</p>
          </div>
          
          <!-- Success Message -->
          <div v-if="success" class="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p class="text-primary text-sm font-medium">{{ success }}</p>
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full primary-btn"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </div>
        
        <!-- Register Link -->
        <div class="text-center">
          <p class="text-grey-black">
            Pas encore de compte ?
            <NuxtLink to="/register" class="font-medium accent-text-primary hover:text-primary transition-colors">
              Créer un compte
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false
})

// Store d'authentification
const authStore = useAuthStore()

// État du formulaire
const form = reactive({
  email: '',
  password: ''
})

const success = ref('')

// Effacer les erreurs au changement de champ
watch(() => form.email, () => authStore.clearError())
watch(() => form.password, () => authStore.clearError())

// Vérifier si déjà connecté
onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isLoggedIn) {
    await navigateTo('/profil')
  }
})

// Fonction de gestion de la connexion
const handleLogin = async () => {
  success.value = ''
  
  try {
    const result = await authStore.login(form.email, form.password)
    
    success.value = result.message || 'Connexion réussie !'
    
    // Redirection après connexion réussie
    setTimeout(() => {
      navigateTo('/profil')
    }, 1500)
    
  } catch (err: any) {
    console.error('Erreur connexion:', err)
    // L'erreur est déjà gérée dans le store
  }
}
</script> 