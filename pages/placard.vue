<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Mon Placard</h2>
        <p class="accent-text text-xl">Gérez vos produits naturels</p>
      </div>

      <!-- Section d'actions principales -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-2xl">🏺</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Votre placard virtuel</h3>
              <p class="text-sm text-grey-black/60">
                {{ placardItems.length }} produit(s) dans votre placard
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="showAddForm = !showAddForm"
              class="primary-btn"
            >
              <span v-if="showAddForm">✕ Annuler</span>
              <span v-else">+ Ajouter un produit</span>
            </button>
            <button
              @click="handleClearPlacard"
              :disabled="loading || placardItems.length === 0"
              class="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ Vider le placard
            </button>
          </div>
        </div>
      </div>

      <!-- Messages d'état -->
      <div v-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-start">
          <p class="text-secondary text-sm font-medium">{{ error }}</p>
          <button @click="clearError" class="text-secondary hover:text-secondary/80">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="success" class="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-start">
          <p class="text-primary text-sm font-medium">{{ success }}</p>
          <button @click="clearSuccess" class="text-primary hover:text-primary/80">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <div v-if="showAddForm" class="bg-blanc p-6 rounded-2xl border border-beige mb-8 shadow-sm">
        <h3 class="text-lg font-semibold mb-6">Ajouter un produit au placard</h3>
        
        <!-- Recherche de produits -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            Rechercher un produit
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="searchProduits"
              type="text"
              placeholder="Tapez le nom d'un produit..."
              class="w-full px-4 py-3 pr-10 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span class="text-grey-black/60">🔍</span>
            </div>
          </div>
        </div>

        <!-- Loading des produits -->
        <div v-if="loadingProduits" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p class="mt-2 text-sm text-grey-black/60">Recherche en cours...</p>
        </div>

        <!-- Résultats de recherche -->
        <div v-if="searchResults.length > 0" class="mb-6">
          <h4 class="text-sm font-medium mb-3">Produits disponibles :</h4>
          <div class="grid gap-3 max-h-60 overflow-y-auto">
            <div 
              v-for="produit in searchResults" 
              :key="produit.id"
              @click="selectProduitToAdd(produit)"
              class="flex items-center gap-3 p-3 bg-beige/30 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors group"
              :class="{ 'bg-primary/20': selectedProduit?.id === produit.id }"
            >
              <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span class="text-lg">{{ produit.imageUrl }}</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-grey-black group-hover:text-primary">{{ produit.nom }}</p>
                <p class="text-xs text-grey-black/60">{{ produit.nomScientifique }}</p>
              </div>
              <div v-if="isAlreadyInPlacard(produit.id)" class="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                Déjà ajouté
              </div>
            </div>
          </div>
        </div>

        <!-- Produit sélectionné -->
        <div v-if="selectedProduit" class="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <h4 class="text-sm font-medium mb-2">Produit sélectionné :</h4>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-xl">{{ selectedProduit.imageUrl }}</span>
            </div>
            <div>
              <p class="font-semibold">{{ selectedProduit.nom }}</p>
              <p class="text-sm text-grey-black/60">{{ selectedProduit.nomScientifique }}</p>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleAddToPlacard"
            :disabled="!selectedProduit || loading || isAlreadyInPlacard(selectedProduit?.id)"
            class="primary-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Ajout...</span>
            <span v-else-if="isAlreadyInPlacard(selectedProduit?.id)">Déjà dans le placard</span>
            <span v-else>Ajouter au placard</span>
          </button>
          
          <button
            @click="resetAddForm"
            class="secondary-btn"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Loading placard -->
      <div v-if="loading && !showAddForm" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-2 text-grey-black/60">Chargement du placard...</p>
      </div>

      <!-- Liste des produits du placard -->
      <div v-else-if="placardItems.length > 0" class="space-y-6">
        <div class="bg-beige/30 backdrop-blur-sm p-6 rounded-2xl border border-beige">
          <h3 class="text-xl font-semibold mb-2">Vos produits</h3>
          <p class="accent-text">{{ placardItems.length }} produit(s) disponible(s)</p>
        </div>

        <!-- Grille des produits -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in placardItems" 
            :key="item.id"
            class="bg-blanc p-6 rounded-2xl border border-beige hover:border-primary/20 transition-all group"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span class="text-2xl">{{ item.details?.imageUrl || '🌿' }}</span>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-semibold">{{ item.produit }}</h4>
                <p class="text-sm accent-text">{{ item.details?.nomScientifique || 'Produit naturel' }}</p>
              </div>
            </div>
            
            <!-- Informations du produit -->
            <div v-if="item.details" class="mb-4">
              <p class="text-sm text-grey-black/80 mb-3 line-clamp-3">
                {{ getShortDescription(item.details) }}
              </p>
              
              <div class="flex flex-wrap gap-2 mb-3">
                <span 
                  v-for="propriete in getProduitsProps(item.details).slice(0, 2)" 
                  :key="propriete"
                  class="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                >
                  {{ propriete }}
                </span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                v-if="item.details"
                @click="navigateTo(`/product/${item.details.id}`)"
                class="flex-1 text-primary hover:bg-primary/10 text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Voir détails
              </button>
              <button
                @click="handleRemoveFromPlacard(item.id, item.produit)"
                :disabled="loading"
                class="text-secondary hover:bg-secondary/10 text-sm font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Retirer
              </button>
            </div>
            
            <!-- Date d'ajout -->
            <div class="mt-3 pt-3 border-t border-beige">
              <p class="text-xs text-grey-black/60">
                Ajouté le {{ formatDate(item.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Placard vide -->
      <div v-else class="bg-blanc p-8 rounded-2xl border border-beige text-center">
        <div class="w-20 h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">🏺</span>
        </div>
        <h3 class="text-lg font-semibold mb-3">Votre placard est vide</h3>
        <p class="accent-text mb-6">Commencez par ajouter des produits naturels pour organiser votre bien-être</p>
        <button
          @click="showAddForm = true"
          class="primary-btn"
        >
          Ajouter mon premier produit
        </button>
      </div>

      <!-- Conseils d'utilisation -->
      <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10 mt-8">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>Conseils pour votre placard</span>
        </h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📦</span>
            <span class="text-sm font-medium">Organisez par catégorie</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📅</span>
            <span class="text-sm font-medium">Suivez les dates d'expiration</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">⚠️</span>
            <span class="text-sm font-medium">Respectez les précautions</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">🌡️</span>
            <span class="text-sm font-medium">Conservez correctement</span>
          </div>
        </div>
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
const { produits, loadProduits, getProduitsProps } = useProduits()
const { 
  items: placardItems, 
  loading, 
  error: placardError, 
  loadPlacard, 
  addToPlacard, 
  removeFromPlacardById, 
  clearPlacard,
  clearError: clearPlacardError,
  isInPlacard
} = usePlacard()

// Types
interface Produit {
  id: number
  nom: string
  nomScientifique: string
  famille: string
  partie: string
  composition: string
  formeGalenique: number
  proprietesPrincipales: string
  proprietesSecondaires: string
  utilisation: string
  precautions: string
  source: string
  imageUrl: string
  slug: string
}

// État réactif local
const searchQuery = ref('')
const searchResults = ref<Produit[]>([])
const selectedProduit = ref<Produit | null>(null)
const showAddForm = ref(false)
const loadingProduits = ref(false)
const success = ref('')

// Computed pour gérer les erreurs
const error = computed({
  get: () => placardError.value,
  set: (value) => {
    // Ne rien faire, on utilise clearError
  }
})

// Rechercher des produits
const searchProduits = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  loadingProduits.value = true
  try {
    // Charger les produits si pas encore fait
    if (produits.value.length === 0) {
      await loadProduits()
    }
    
    // Filtrer les produits selon la recherche
    const query = searchQuery.value.toLowerCase()
    searchResults.value = produits.value.filter(produit => 
      produit.nom.toLowerCase().includes(query) ||
      produit.nomScientifique.toLowerCase().includes(query) ||
      produit.proprietesPrincipales.toLowerCase().includes(query)
    ).slice(0, 5) // Limiter à 5 résultats
    
  } catch (err) {
    console.error('Erreur recherche produits:', err)
  } finally {
    loadingProduits.value = false
  }
}

// Sélectionner un produit à ajouter
const selectProduitToAdd = (produit: Produit) => {
  selectedProduit.value = produit
}

// Vérifier si un produit est déjà dans le placard
const isAlreadyInPlacard = (produitId: number | undefined) => {
  if (!produitId) return false
  return isInPlacard(produitId)
}

// Ajouter un produit au placard
const handleAddToPlacard = async () => {
  if (!selectedProduit.value) return
  
  success.value = ''
  
  try {
    await addToPlacard(selectedProduit.value.id)
    success.value = 'Produit ajouté avec succès !'
    resetAddForm()
    
    // Auto-clear du message
    setTimeout(() => success.value = '', 3000)
    
  } catch (err) {
    console.error('Erreur ajout:', err)
  }
}

// Retirer un produit du placard
const handleRemoveFromPlacard = async (itemId: number, produitName: string) => {
  if (!confirm(`Êtes-vous sûr de vouloir retirer "${produitName}" de votre placard ?`)) {
    return
  }
  
  success.value = ''
  
  try {
    await removeFromPlacardById(itemId)
    success.value = 'Produit retiré avec succès !'
    
    // Auto-clear du message
    setTimeout(() => success.value = '', 3000)
    
  } catch (err) {
    console.error('Erreur suppression:', err)
  }
}

// Vider le placard
const handleClearPlacard = async () => {
  if (!confirm('Êtes-vous sûr de vouloir vider complètement votre placard ?')) {
    return
  }
  
  success.value = ''
  
  try {
    await clearPlacard()
    success.value = 'Placard vidé avec succès !'
    
    // Auto-clear du message
    setTimeout(() => success.value = '', 3000)
    
  } catch (err) {
    console.error('Erreur vidage:', err)
  }
}

// Réinitialiser le formulaire d'ajout
const resetAddForm = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedProduit.value = null
  showAddForm.value = false
}

// Effacer les messages
const clearError = () => clearPlacardError()
const clearSuccess = () => success.value = ''

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return 'Date inconnue'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Fonction utilitaire pour obtenir une description courte
const getShortDescription = (produit: any) => {
  if (!produit) return ''
  const description = `${produit.proprietesPrincipales}. ${produit.utilisation.split('.')[0]}.`
  return description.length > 120 ? description.substring(0, 120) + '...' : description
}

// Lifecycle
onMounted(async () => {
  await loadPlacard()
})

// Meta données pour le SEO
useSeoMeta({
  title: 'Mon Placard - Wonder Wo',
  ogTitle: 'Mon Placard - Wonder Wo',
  description: 'Gérez vos produits naturels avec votre placard virtuel Wonder Wo.',
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