<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- En-tête -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-grey-black mb-2">Administration Wonder Wo</h1>
            <p class="text-grey-black/60">Gestion des utilisateurs et des produits</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-grey-black/60">Connecté en tant que</p>
            <p class="font-medium text-primary">{{ authStore.user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-grey-black/60 mb-1">Utilisateurs</h3>
              <p class="text-2xl font-bold text-grey-black">{{ stats.users }}</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-grey-black/60 mb-1">Produits</h3>
              <p class="text-2xl font-bold text-grey-black">{{ stats.products }}</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span class="text-2xl">🌿</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-grey-black/60 mb-1">Recettes</h3>
              <p class="text-2xl font-bold text-grey-black">{{ stats.recipes }}</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span class="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-grey-black/60 mb-1">Administrateurs</h3>
              <p class="text-2xl font-bold text-grey-black">{{ stats.admins }}</p>
            </div>
            <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span class="text-2xl">🔐</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation principale -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Gestion des utilisateurs -->
        <div class="bg-blanc p-8 rounded-2xl border border-beige shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span class="text-3xl">👥</span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-grey-black">Gestion des utilisateurs</h2>
              <p class="text-grey-black/60">Gérer les comptes et les rôles</p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Total utilisateurs:</span>
              <span class="font-medium">{{ stats.users }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Administrateurs:</span>
              <span class="font-medium text-secondary">{{ stats.admins }}</span>
            </div>
          </div>

          <NuxtLink 
            to="/admin/users" 
            class="w-full bg-primary text-blanc py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors block text-center"
          >
            Gérer les utilisateurs
          </NuxtLink>
        </div>

        <!-- Gestion des produits -->
        <div class="bg-blanc p-8 rounded-2xl border border-beige shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span class="text-3xl">🌿</span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-grey-black">Gestion des produits</h2>
              <p class="text-grey-black/60">Modifier les fiches produits</p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Total produits:</span>
              <span class="font-medium">{{ stats.products }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Dernière mise à jour:</span>
              <span class="font-medium">{{ lastUpdate }}</span>
            </div>
          </div>

          <NuxtLink 
            to="/admin/products" 
            class="w-full bg-primary text-blanc py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors block text-center"
          >
            Gérer les produits
          </NuxtLink>
        </div>

        <!-- Gestion des recettes -->
        <div class="bg-blanc p-8 rounded-2xl border border-beige shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span class="text-3xl">📋</span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-grey-black">Gestion des recettes</h2>
              <p class="text-grey-black/60">Modifier les recettes de remèdes</p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Total recettes:</span>
              <span class="font-medium">{{ stats.recipes }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Dernière mise à jour:</span>
              <span class="font-medium">{{ lastUpdate }}</span>
            </div>
          </div>

          <NuxtLink 
            to="/admin/recipes" 
            class="w-full bg-primary text-blanc py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors block text-center"
          >
            Gérer les recettes
          </NuxtLink>
        </div>

        <!-- Gestion des commentaires -->
        <div class="bg-blanc p-8 rounded-2xl border border-beige shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span class="text-3xl">💬</span>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-grey-black">Gestion des commentaires</h2>
              <p class="text-grey-black/60">Modérer les avis utilisateurs</p>
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">Total commentaires:</span>
              <span class="font-medium">{{ stats.comments || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-grey-black/60">En attente:</span>
              <span class="font-medium text-yellow-600">{{ stats.pendingComments || 0 }}</span>
            </div>
          </div>

          <NuxtLink 
            to="/admin/comments" 
            class="w-full bg-primary text-blanc py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors block text-center"
          >
            Gérer les commentaires
          </NuxtLink>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="mt-8 bg-beige/30 p-6 rounded-2xl border border-beige">
        <h3 class="text-lg font-semibold text-grey-black mb-4">Actions rapides</h3>
        <div class="flex flex-wrap gap-4">
          <NuxtLink 
            to="/" 
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors"
          >
            ← Retour au site
          </NuxtLink>
          <button
            @click="refreshStats"
            :disabled="loading"
            class="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            🔄 Actualiser les statistiques
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false,
  middleware: 'admin'
})

// Store d'authentification
const authStore = useAuthStore()

// État réactif
const loading = ref(false)
const stats = ref({
  users: 0,
  products: 0,
  recipes: 0,
  admins: 0,
  comments: 0,
  pendingComments: 0
})

const lastUpdate = ref('Aujourd\'hui')

// Charger les statistiques
const loadStats = async () => {
  loading.value = true
  
  try {
    console.log('📊 [ADMIN] Chargement des statistiques...')
    const data = await $fetch('/api/admin/stats')
    console.log('📊 [ADMIN] Statistiques reçues:', data)
    
    stats.value = data
    
  } catch (error) {
    console.error('Erreur chargement statistiques:', error)
    // Fallback avec données par défaut
    stats.value = {
      users: 0,
      products: 0,
      recipes: 0,
      admins: 0,
      comments: 0,
      pendingComments: 0
    }
  } finally {
    loading.value = false
  }
}

// Actualiser les statistiques
const refreshStats = async () => {
  await loadStats()
}

// Charger les statistiques au montage
onMounted(() => {
  loadStats()
})

// Meta données pour le SEO
useSeoMeta({
  title: 'Administration - Wonder Wo',
  description: 'Interface d\'administration Wonder Wo',
  robots: 'noindex,nofollow'
})
</script>

<style scoped>
/* Variables CSS pour cohérence */
:root {
  --color-primary: #2D5A27;
  --color-secondary: #E74C3C;
  --color-blanc: #FFFFFF;
  --color-beige: #F5F5DC;
  --color-grey-black: #2C3E50;
}

.bg-primary { background-color: var(--color-primary); }
.text-primary { color: var(--color-primary); }
.border-primary { border-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.text-secondary { color: var(--color-secondary); }
.border-secondary { border-color: var(--color-secondary); }
.bg-blanc { background-color: var(--color-blanc); }
.text-blanc { color: var(--color-blanc); }
.bg-beige { background-color: var(--color-beige); }
.border-beige { border-color: var(--color-beige); }
.text-grey-black { color: var(--color-grey-black); }
</style> 