<template>
  <div class="min-h-screen bg-blanc flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Créer un compte</h2>
        <p class="accent-text">Découvrez les remèdes naturels adaptés à vos besoins</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
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
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Minimum 6 caractères"
            />
          </div>
          
          <!-- Confirm Password -->
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Répétez votre mot de passe"
            />
          </div>
          
          <!-- Error Message -->
          <div v-if="error || authStore.error" class="mb-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
            <p class="text-secondary text-sm font-medium">{{ error || authStore.error }}</p>
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
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </span>
            <span v-else>Créer mon compte</span>
          </button>
        </div>
        
        <!-- Login Link -->
        <div class="text-center">
          <p class="text-grey-black">
            Déjà un compte ?
            <NuxtLink to="/login" class="font-medium accent-text-primary hover:text-primary transition-colors">
              Se connecter
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
  password: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')

// Effacer les erreurs au changement de champ
watch(() => form.email, () => {
  authStore.clearError()
  error.value = ''
})
watch(() => form.password, () => {
  authStore.clearError()
  error.value = ''
})
watch(() => form.confirmPassword, () => {
  error.value = ''
})

// Vérifier si déjà connecté
onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isLoggedIn) {
    await navigateTo('/profil')
  }
})

// Fonction de gestion de l'inscription
const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  // Validation côté client
  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (form.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  try {
    const result = await authStore.register(form.email, form.password)
    
    success.value = result.message || 'Inscription réussie !'
    
    // Redirection après inscription réussie
    setTimeout(() => {
      navigateTo('/profil')
    }, 1500)
    
  } catch (err: any) {
    console.error('Erreur inscription:', err)
    // L'erreur est déjà gérée dans le store
  }
}
</script> 