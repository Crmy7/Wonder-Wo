<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Bibliothèque</h2>
        <p class="accent-text text-xl">Découvrez notre collection de remèdes naturels</p>
      </div>

      <!-- Conteneur des produits de la bibliothèque -->
      <div class="bg-beige/30 backdrop-blur-sm md:p-6 rounded-2xl border border-beige mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 class="text-xl font-semibold mb-1">Produits Naturels</h3>
            <p class="accent-text">{{ filteredProduits.length }} produit(s) disponible(s)</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un produit..."
                class="px-4 py-2 pl-10 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all  w-full md:w-auto"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span class="text-grey-black/60">🔍</span>
              </div>
            </div>
            <button 
              @click="showFilters = !showFilters"
              class="primary-btn"
            >
              Filtrer
            </button>
          </div>
        </div>

        <!-- Filtres -->
        <div v-if="showFilters" class="mb-6 p-4 bg-blanc/50 rounded-xl border border-beige">
          <h4 class="font-semibold mb-3">Filtrer par propriétés :</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="propriete in proprietesUniques"
              :key="propriete"
              @click="togglePropriete(propriete)"
              class="text-sm px-3 py-1 rounded-full transition-colors"
              :class="selectedProprietes.includes(propriete) 
                ? 'bg-primary text-blanc' 
                : 'bg-beige text-grey-black hover:bg-primary/10'"
            >
              {{ propriete }}
            </button>
          </div>
          <div class="mt-3 flex gap-2">
            <button @click="clearFilters" class="text-sm text-secondary hover:underline">
              Effacer les filtres
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-grey-black/60">Chargement des produits...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
          <div class="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
            <p class="text-secondary text-sm font-medium">{{ error }}</p>
            <button @click="loadProduits" class="mt-2 text-sm text-primary hover:underline">
              Réessayer
            </button>
          </div>
        </div>

        <!-- Grille des produits -->
        <div v-else-if="filteredProduits.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="produit in filteredProduits" 
            :key="produit.id"
            class="bg-blanc p-6 rounded-2xl border border-primary/20 md:hover:border-primary/20 transition-all group cursor-pointer"
            @click="navigateTo(`/product/${produit.id}`)"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span class="text-2xl">{{ produit.imageUrl }}</span>
              </div>
              <div>
                <h4 class="text-lg font-semibold">{{ produit.nom }}</h4>
                <p class="text-sm accent-text">{{ produit.nomScientifique }}</p>
              </div>
            </div>
            
            <p class="text-sm text-grey-black/80 mb-4 line-clamp-3">
              {{ getShortDescription(produit) }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="propriete in getProduitsProps(produit).slice(0, 2)" 
                :key="propriete"
                class="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
              >
                {{ propriete }}
              </span>
            </div>
            
            <button class="w-full text-primary hover:bg-primary/10 text-sm font-medium py-2 rounded-lg transition-colors">
              Voir les détails
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <div class="w-20 h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🔍</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
          <p class="accent-text mb-4">
            {{ searchQuery || selectedProprietes.length > 0 
              ? 'Essayez de modifier vos critères de recherche' 
              : 'Aucun produit disponible pour le moment' }}
          </p>
          <button 
            v-if="searchQuery || selectedProprietes.length > 0"
            @click="clearAllFilters" 
            class="secondary-btn"
          >
            Effacer tous les filtres
          </button>
        </div>
      </div>

      <!-- Section informative -->
      <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📚</span>
          <span>À propos de notre bibliothèque</span>
        </h3>
        <p class="text-sm text-grey-black/80">
          Toutes les informations présentes dans cette bibliothèque sont à titre informatif. 
          Consultez toujours un professionnel de santé avant d'utiliser des remèdes naturels.
          Les produits affichés proviennent de sources documentées et validées.
        </p>
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
const { 
  produits, 
  loading, 
  error, 
  loadProduits, 
  searchProduits, 
  filterByProprietes, 
  getProduitsProps, 
  clearError 
} = useProduits()

// État réactif pour les filtres
const searchQuery = ref('')
const selectedProprietes = ref<string[]>([])
const showFilters = ref(false)

// Produits filtrés
const filteredProduits = computed(() => {
  let result = produits.value

  // Appliquer la recherche textuelle
  if (searchQuery.value.trim()) {
    result = searchProduits(searchQuery.value)
  }

  // Appliquer les filtres de propriétés
  if (selectedProprietes.value.length > 0) {
    result = result.filter(produit => 
      selectedProprietes.value.some(prop => 
        produit.proprietesPrincipales.toLowerCase().includes(prop.toLowerCase()) ||
        produit.proprietesSecondaires.toLowerCase().includes(prop.toLowerCase())
      )
    )
  }

  return result
})

// Propriétés uniques pour les filtres
const proprietesUniques = computed(() => {
  const props = new Set<string>()
  
  produits.value.forEach(produit => {
    const principales = produit.proprietesPrincipales.split(',').map(p => p.trim())
    const secondaires = produit.proprietesSecondaires.split(',').map(p => p.trim())
    
    principales.forEach(p => p && props.add(p))
    secondaires.forEach(p => p && props.add(p))
  })
  
  return Array.from(props).sort()
})

// Méthodes
const togglePropriete = (propriete: string) => {
  const index = selectedProprietes.value.indexOf(propriete)
  if (index > -1) {
    selectedProprietes.value.splice(index, 1)
  } else {
    selectedProprietes.value.push(propriete)
  }
}

const clearFilters = () => {
  selectedProprietes.value = []
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedProprietes.value = []
  showFilters.value = false
}

const getShortDescription = (produit: any) => {
  // Créer une description courte basée sur les propriétés et l'utilisation
  const description = `${produit.proprietesPrincipales}. ${produit.utilisation.split('.')[0]}.`
  return description.length > 120 ? description.substring(0, 120) + '...' : description
}

// Lifecycle
onMounted(async () => {
  try {
    await loadProduits()
  } catch (err) {
    console.error('Erreur lors du chargement initial des produits:', err)
  }
})

// Meta données pour le SEO
useSeoMeta({
  title: 'Bibliothèque - Wonder Wo',
  ogTitle: 'Bibliothèque - Wonder Wo',
  description: 'Découvrez notre collection complète de remèdes naturels avec des informations détaillées sur chaque produit.',
  ogDescription: 'Découvrez notre collection complète de remèdes naturels avec des informations détaillées sur chaque produit.',
})

// Effacer les erreurs quand l'utilisateur interagit
watch([searchQuery, selectedProprietes], () => {
  clearError()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>