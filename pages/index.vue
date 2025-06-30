<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    <!-- Header -->
    <header class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-green-800 text-center">Wonder Wo</h1>
        <p class="text-xl text-gray-600 text-center mt-2">Vos remèdes naturels personnalisés</p>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          Découvrez les bienfaits de la nature
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Wonder Wo vous accompagne dans votre recherche de bien-être naturel. 
          Recevez des recommandations personnalisées de remèdes naturels adaptés à vos symptômes, 
          votre profil et les produits de votre placard.
        </p>
        
        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🤖
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">IA Personnalisée</h3>
            <p class="text-gray-600">Recommandations adaptées à votre profil et vos besoins spécifiques</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              🌿
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Placard Virtuel</h3>
            <p class="text-gray-600">Gérez vos produits naturels et optimisez leurs utilisations</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              📚
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Bibliothèque</h3>
            <p class="text-gray-600">Consultez notre base de données complète de remèdes naturels</p>
          </div>
        </div>
        
        <!-- CTA Buttons -->
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <NuxtLink
            to="/register"
            class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Commencer gratuitement
          </NuxtLink>
          
          <NuxtLink
            to="/login"
            class="inline-block bg-white hover:bg-gray-50 text-green-600 font-medium px-8 py-3 rounded-lg border border-green-600 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Se connecter
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500">© 2024 Wonder Wo - Votre bien-être naturel</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false
})
</script>
