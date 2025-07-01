<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-grey-black/60 mb-6">
        <NuxtLink to="/library" class="hover:text-primary transition-colors">
          Bibliothèque
        </NuxtLink>
        <span>></span>
        <span class="text-grey-black">{{ product?.nom || 'Chargement...' }}</span>
      </nav>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-2 text-grey-black/60">Chargement du produit...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8">
        <div class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 max-w-md mx-auto">
          <p class="text-secondary text-sm font-medium mb-3">{{ error }}</p>
          <NuxtLink to="/library" class="text-primary hover:underline text-sm">
            Retour à la bibliothèque
          </NuxtLink>
        </div>
      </div>

      <!-- Product content -->
      <div v-else-if="product">
        <!-- Header du produit -->
        <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-4xl">{{ product.imageUrl }}</span>
            </div>
            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2">{{ product.nom }}</h1>
              <p class="text-lg accent-text mb-3">{{ product.nomScientifique }}</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="propriete in getProduitsProps(product).slice(0, 3)" 
                  :key="propriete"
                  class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
                >
                  {{ propriete }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Informations principales -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Composition -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🧪</span>
                <span>Composition</span>
              </h2>
              <p class="text-grey-black/80 leading-relaxed">{{ product.composition }}</p>
            </div>

            <!-- Propriétés thérapeutiques -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Propriétés thérapeutiques</span>
              </h2>
              <div class="space-y-3">
                <div>
                  <h3 class="font-semibold text-primary mb-2">Propriétés principales</h3>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="prop in product.proprietesPrincipales.split(',').map(p => p.trim())" 
                      :key="prop"
                      class="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                    >
                      {{ prop }}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-secondary mb-2">Propriétés secondaires</h3>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="prop in product.proprietesSecondaires.split(',').map(p => p.trim())" 
                      :key="prop"
                      class="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full"
                    >
                      {{ prop }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Utilisation -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔧</span>
                <span>Mode d'utilisation</span>
              </h2>
              <div class="prose prose-sm max-w-none">
                <p class="text-grey-black/80 leading-relaxed whitespace-pre-line">{{ product.utilisation }}</p>
              </div>
            </div>

            <!-- Précautions -->
            <div class="bg-secondary/5 p-6 rounded-2xl border border-secondary/20">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-secondary">
                <span>⚠️</span>
                <span>Précautions d'emploi</span>
              </h2>
              <div class="prose prose-sm max-w-none">
                <p class="text-grey-black/80 leading-relaxed whitespace-pre-line">{{ product.precautions }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Actions -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige space-y-3">
              <h3 class="font-semibold mb-4">Actions</h3>
              <button class="w-full primary-btn">
                💾 Ajouter au placard
              </button>
              <button class="w-full secondary-btn">
                ⭐ Marquer comme favori
              </button>
              <button class="w-full text-primary hover:bg-primary/10 text-sm font-medium py-2 rounded-lg transition-colors border border-primary/20">
                📤 Partager
              </button>
            </div>

            <!-- Informations botaniques -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige">
              <h3 class="font-semibold mb-4">Informations botaniques</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-grey-black/60">Famille :</span>
                  <span class="font-medium">{{ product.famille }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-grey-black/60">Partie utilisée :</span>
                  <span class="font-medium">{{ product.partie }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-grey-black/60">Forme galénique :</span>
                  <span class="font-medium">{{ getFormeGalenique(product.formeGalenique) }}</span>
                </div>
              </div>
            </div>

            <!-- Source -->
            <div class="bg-beige/30 p-6 rounded-2xl border border-beige">
              <h3 class="font-semibold mb-4">Source</h3>
              <p class="text-sm text-grey-black/80">{{ product.source }}</p>
            </div>

            <!-- Retour -->
            <div class="bg-blanc p-6 rounded-2xl border border-beige">
              <NuxtLink to="/library" class="w-full secondary-btn block text-center">
                ← Retour à la bibliothèque
              </NuxtLink>
            </div>
          </div>
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

// Composables
const route = useRoute()
const { produits, loading, error, loadProduits, getProduitsProps } = useProduits()

// ID du produit depuis l'URL
const productId = computed(() => parseInt(route.params.id as string))

// Produit actuel
const product = computed(() => {
  return produits.value.find(p => p.id === productId.value)
})

// Fonction utilitaire pour les formes galéniques
const getFormeGalenique = (forme: number): string => {
  const formes = {
    1: 'Tisane/Infusion',
    2: 'Miel/Sirop',
    3: 'Huile essentielle',
    4: 'Gélules/Comprimés',
    5: 'Poudre',
    6: 'Extrait liquide',
    7: 'Crème/Baume',
    8: 'Autre'
  }
  return formes[forme as keyof typeof formes] || 'Non spécifié'
}

// Charger les produits si pas encore fait
onMounted(async () => {
  if (produits.value.length === 0) {
    try {
      await loadProduits()
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
    }
  }
})

// Vérifier si le produit existe après chargement
watchEffect(() => {
  if (!loading.value && produits.value.length > 0 && !product.value) {
    error.value = 'Produit non trouvé'
  }
})

// Meta données pour le SEO
useSeoMeta({
  title: computed(() => product.value ? `${product.value.nom} - Wonder Wo` : 'Produit - Wonder Wo'),
  ogTitle: computed(() => product.value ? `${product.value.nom} - Wonder Wo` : 'Produit - Wonder Wo'),
  description: computed(() => product.value ? `${product.value.nom} (${product.value.nomScientifique}) - ${product.value.proprietesPrincipales}` : 'Découvrez ce remède naturel sur Wonder Wo'),
})
</script>