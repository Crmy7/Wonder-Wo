<template>
  <div class="min-h-screen bg-blanc">
    <!-- Header -->
    <header class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-center">Wonder Wo</h1>
        <p class="text-xl text-center mt-2">
          Vos remèdes naturels personnalisés
        </p>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          Découvrez les bienfaits de la nature
        </h2>
        <p class="text-lg mb-8 max-w-3xl mx-auto">
          Wonder Wo vous accompagne dans votre recherche de bien-être naturel.
          Recevez des recommandations personnalisées de remèdes naturels adaptés
          à vos symptômes, votre profil et les produits de votre placard.
        </p>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              🤖
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              IA Personnalisée
            </h3>
            <p class="text-gray-600">
              Recommandations adaptées à votre profil et vos besoins spécifiques
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              🌿
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Placard Virtuel
            </h3>
            <p class="text-gray-600">
              Gérez vos produits naturels et optimisez leurs utilisations
            </p>
          </div>

          <a class="bg-white p-6 rounded-xl shadow-lg" href="/library">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              📚
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Bibliothèque
            </h3>
            <p class="text-gray-600">
              Consultez notre base de données complète de remèdes naturels
            </p>
          </a>
        </div>
        
        <!-- CTA Buttons -->
         <NuxtLink to="/maux" class="secondary-btn">
              Rechercher un remède
        </NuxtLink>
        <!-- Only if not logged in -->
        <div v-if="!authStore.loading && !authStore.isLoggedIn">
          <div
            class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
          >
            <NuxtLink to="/register" class="primary-btn">
              Commencer gratuitement
            </NuxtLink>

            <NuxtLink to="/login" class="secondary-btn">
              Se connecter
            </NuxtLink>
          </div>
          
          <!-- Bouton pour revoir l'onboarding -->
          <div class="mt-6">
            <button 
              @click="showOnboardingAgain"
              class="onboarding-trigger"
            >
              ✨ Revoir la présentation de Wonder Wo
            </button>
          </div>
        </div>
        <div v-else-if="!authStore.loading && authStore.isLoggedIn">
          <div class="space-y-4">
            <p class="text-grey-black">Vous êtes déjà connecté !</p>
            
            <!-- Bouton pour utilisateurs connectés -->
            <div>
              <button 
                @click="showOnboardingAgain"
                class="onboarding-trigger"
              >
                ✨ Revoir la présentation de Wonder Wo
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="authStore.loading">
          <p class="text-center text-grey-black">Chargement...</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500">© 2024 Wonder Wo - Votre bien-être naturel</p>
        
        <!-- Lien discret dans le footer pour relancer l'onboarding -->
        <div class="mt-4">
          <button 
            @click="showOnboardingAgain"
            class="text-xs text-gray-400 hover:text-primary transition-colors duration-300"
          >
            Guide de l'application
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()

// Configuration de la page
definePageMeta({
  layout: false,
})

// Fonction pour relancer l'onboarding
const showOnboardingAgain = () => {
  onboardingStore.showOnboarding()
}
</script>
