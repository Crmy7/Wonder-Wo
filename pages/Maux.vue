<template>
  <div class="min-h-screen bg-blanc">
    <!-- Barre de navigation -->
    <div class="sticky top-0 bg-blanc/90 backdrop-blur-sm border-b border-beige z-[51]">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <a href="/maux" class="flex items-center gap-2 text-grey-black/60 hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="font-medium">Retour</span>
          </a>
          
          <h1 class="font-effloresce text-xl text-primary">🤒 Recherche de remèdes</h1>
          
          <div class="w-16"></div> <!-- Spacer pour centrer le titre -->
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-6">

      <!-- Section de recherche -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8 z-50 relative">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold mb-2">Rechercher un remède naturel</h3>
          <p class="text-grey-black/60">Décrivez votre symptôme pour obtenir des recommandations personnalisées</p>
          
          <!-- Affichage du profil actif -->
          <div v-if="currentProfil" class="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            <div class="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold">{{ currentProfil.nom.charAt(0) }}</span>
            </div>
            <span>Recherche pour {{ currentProfil.nom }}</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div class="flex-1 relative">
            <input
              v-model="searchTerm"
              @input="handleInput"
              @keyup.enter="handleSearch"
              @keydown="handleKeydown"
              @focus="handleFocus"
              @blur="handleBlur"
              type="text"
              placeholder="Ex: mal de tête, stress, insomnie..."
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              autocomplete="off"
            />
            
            <!-- Menu des suggestions -->
            <div 
              v-if="suggestionsVisible && suggestions.length > 0"
              class="absolute top-full left-0 right-0 bg-blanc border border-beige rounded-xl mt-1 shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div class="p-2">
                <div class="text-xs text-grey-black/60 mb-2 px-2">
                  {{ suggestions.length }} suggestion(s) trouvée(s)
                </div>
                <button
                  v-for="(suggestion, index) in suggestions"
                  :key="suggestion.id"
                  @click="selectSuggestion(suggestion)"
                  :class="{ 'bg-primary/10': index === selectedSuggestionIndex }"
                  class="w-full text-left p-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div class="font-medium text-sm" v-html="suggestion.highlighted"></div>
                </button>
              </div>
            </div>
            
            <!-- Indicateur de chargement des suggestions -->
            <div 
              v-if="suggestionsLoading" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div class="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
          <button 
            @click="handleSearch"
            :disabled="loading || !searchTerm.trim()"
            class="primary-btn px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Recherche...</span>
            <span v-else>🔍 Rechercher</span>
          </button>
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

      <!-- Informations sur le placard et résultats -->
      <div v-if="searched && placardInfo" class="bg-beige/30 backdrop-blur-sm p-6 rounded-2xl border border-beige mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold mb-1">Résultats pour "{{ lastSearchTerm }}"</h3>
            <div class="flex flex-wrap items-center gap-4 text-sm text-grey-black/70">
              <span>{{ totalRemedes }} remède(s) trouvé(s)</span>
              <span v-if="remedesAvecPlacardCount > 0" class="text-primary font-medium">
                🏺 {{ remedesAvecPlacardCount }} avec vos produits
              </span>
              <span v-if="placardInfo.recettesSansPlacard > 0" class="text-grey-black/60">
                📦 {{ placardInfo.recettesSansPlacard }} nécessitent d'autres produits
              </span>
            </div>
          </div>
          
          <div v-if="placardInfo.totalProduits > 0" class="text-right">
            <p class="text-sm font-medium text-primary">Votre placard</p>
            <p class="text-xs text-grey-black/60">{{ placardInfo.totalProduits }} produit(s) disponible(s)</p>
          </div>
        </div>

        <!-- Information sur le tri intelligent -->
        <div class="hidden mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center gap-2 text-blue-700 text-sm">
            <span>💡</span>
            <span class="font-medium">Tri intelligent activé</span>
          </div>
          <p class="text-blue-600 text-xs mt-1">
            Les recettes sont automatiquement triées par priorité : 
            <strong>1)</strong> Celles utilisant vos produits du placard, 
            <strong>2)</strong> Celles adaptées à votre âge, 
            <strong>3)</strong> Les plus efficaces.
          </p>
        </div>
      </div>

      <!-- Incitation placard (si aucune recette avec le placard) -->
      <div v-if="searched && incitationPlacard" class="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-6">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-lg">🏺</span>
          </div>
          
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-2 flex items-center gap-2">
              <span>💡 Astuce pour des recettes personnalisées</span>
            </h3>
            <p class="text-grey-black/70 mb-3 text-sm">{{ incitationPlacard.message }}</p>
            
            <div class="flex flex-wrap gap-2">
              <button
                v-for="produit in incitationPlacard.produitsRecommandes"
                :key="produit.id"
                @click="ajouterProduitRecommande(produit.id)"
                :disabled="loadingPlacard"
                class="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span>+ {{ produit.nom }}</span>
                <span class="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {{ produit.count }}
                </span>
              </button>
            </div>
            
            <p class="text-xs text-grey-black/60 mt-2">
              En ajoutant ces produits, vous accéderez à plus de recettes personnalisées.
            </p>
          </div>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div v-if="searched && hasResults" class="space-y-8">
        <!-- Section : Recettes avec vos produits du placard -->
        <div v-if="resultatsAvecPlacard.length > 0" class="space-y-4">
          <div class="bg-primary/5 p-4 rounded-xl border border-primary/20">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xl">🏺</span>
              <h3 class="text-lg font-semibold text-primary">Recettes avec vos produits du placard</h3>
            </div>
            <p class="text-sm text-grey-black/70">
              {{ resultatsAvecPlacard.length }} recette{{ resultatsAvecPlacard.length > 1 ? 's' : '' }} 
              utilisant les produits déjà dans votre placard
            </p>
          </div>
          
          <div class="grid gap-6">
            <RemedyCard 
              v-for="recette in resultatsAvecPlacard" 
              :key="recette.id" 
              :remedy="recette"
              @products-added="handleProductsAdded"
            />
          </div>
        </div>

        <!-- Section : Autres résultats -->
        <div v-if="resultatsAucunPlacard.length > 0" class="space-y-4">
          <div class="bg-beige/30 p-4 rounded-xl border border-beige">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xl">📦</span>
              <h3 class="text-lg font-semibold text-grey-black">Autres résultats</h3>
            </div>
            <p class="text-sm text-grey-black/70">
              {{ resultatsAucunPlacard.length }} recette{{ resultatsAucunPlacard.length > 1 ? 's' : '' }} 
              nécessitant d'autres produits
            </p>
          </div>
          
          <div class="grid gap-6">
            <RemedyCard 
              v-for="recette in resultatsAucunPlacard" 
              :key="recette.id" 
              :remedy="recette"
              @products-added="handleProductsAdded"
            />
          </div>
        </div>

        <!-- Message si tous les résultats utilisent le placard -->
        <div v-if="resultatsAvecPlacard.length > 0 && resultatsAucunPlacard.length === 0" class="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
          <span class="text-3xl">🎉</span>
          <h3 class="text-lg font-semibold text-primary mt-2 mb-1">Parfait !</h3>
          <p class="text-sm text-grey-black/70">
            Tous les remèdes trouvés utilisent les produits de votre placard.
          </p>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="searched && !hasResults" class="bg-blanc p-8 rounded-2xl border border-beige text-center">
        <div class="w-20 h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">🔍</span>
        </div>
        <h3 class="text-lg font-semibold mb-3">Aucun remède trouvé</h3>
        <p class="accent-text mb-6">
          Aucune recette trouvée pour "{{ lastSearchTerm }}". 
          <br>Cela peut signifier que :
        </p>
        <div class="text-sm text-grey-black/70 mb-6 space-y-2">
          <p>• La base de données est vide</p>
          <p>• Aucun remède ne correspond à ce symptôme</p>
          <p>• Essayez avec d'autres mots-clés</p>
        </div>
        <button 
          @click="resetSearch"
          class="secondary-btn"
        >
          Nouvelle recherche
        </button>
      </div>

      <!-- Suggestions populaires -->
      <div v-if="!searched" class="bg-blanc p-6 rounded-2xl border border-beige">
        <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
          <span>Recherches populaires</span>
          <span v-if="symptomesLoading" class="text-xs text-grey-black/60">Chargement...</span>
        </h3>
        <p class="text-sm text-grey-black/60 mb-4">Symptômes avec recettes disponibles dans notre base</p>
        
        <!-- État de chargement -->
        <div v-if="symptomesLoading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            v-for="i in 6" 
            :key="i"
            class="p-3 bg-beige/20 rounded-xl animate-pulse"
          >
            <div class="h-4 bg-beige/40 rounded w-3/4"></div>
          </div>
        </div>
        
        <!-- Suggestions chargées -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button 
            v-for="suggestion in symptomesPopulaires" 
            :key="suggestion"
            @click="searchSuggestion(suggestion)"
            class="text-left p-3 bg-beige/30 hover:bg-primary/10 rounded-xl transition-colors group"
          >
            <span class="text-sm font-medium text-grey-black group-hover:text-primary">{{ suggestion }}</span>
          </button>
        </div>
        
        <!-- Message si aucun symptôme trouvé -->
        <div v-if="!symptomesLoading && symptomesPopulaires.length === 0" class="text-center py-4">
          <p class="text-grey-black/60 text-sm">Aucun symptôme populaire disponible</p>
        </div>
      </div>

      <!-- Conseils -->
      <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10 mt-8">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>Conseils de recherche</span>
        </h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">🎯</span>
            <span class="text-sm font-medium">Soyez précis dans vos symptômes</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">🏺</span>
            <span class="text-sm font-medium">Priorité aux produits de votre placard</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">👨‍⚕️</span>
            <span class="text-sm font-medium">Consultez un professionnel si nécessaire</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📝</span>
            <span class="text-sm font-medium">Respectez les précautions d'emploi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResultatRecherche } from '~/types/maux'

// Configuration de la page
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Composables
const { currentProfil } = useProfils()
const { 
  resultats,
  resultatsAvecPlacard,
  resultatsAucunPlacard,
  placardInfo,
  incitationPlacard,
  loading,
  error,
  searched,
  lastSearchTerm,
  hasResults,
  totalRemedes,
  remedesAvecPlacardCount,
  getRemediesAvecPlacard,
  getRemediesSansPlacard,
  getRemediesTries,
  rechercherAvecProfilActuel,
  resetRecherche,
  clearError,
  ajouterTousProduitsAuPlacard,
  ajouterProduitRecommande,
  symptomesPopulaires,
  symptomesLoading,
  chargerSymptomesPopulaires,
  suggestions,
  suggestionsLoading,
  suggestionsVisible,
  rechercherSuggestions,
  masquerSuggestions,
  selectionnerSuggestion
} = useMaux()

// État local
const searchTerm = ref('')
const loadingPlacard = ref(false)
const selectedSuggestionIndex = ref(-1)

// Debounce pour les suggestions
let suggestionsTimeout: NodeJS.Timeout | null = null

// Auto-remplir depuis query params et charger les symptômes populaires
onMounted(async () => {
  console.log('🔍 [PAGE] Montage de la page Maux')
  
  // Charger les symptômes populaires dès le montage
  await chargerSymptomesPopulaires()
  
  // Auto-remplir depuis query params si présent
  const route = useRoute()
  if (route.query.q) {
    searchTerm.value = route.query.q as string
    await handleSearch()
  }
})


// Gérer l'ajout de produits depuis le composant RemedyCard
const handleProductsAdded = async () => {
  // Relancer la recherche pour mettre à jour les statuts des produits dans le placard
  if (lastSearchTerm.value) {
    await rechercherAvecProfilActuel(lastSearchTerm.value)
  }
}

// Gestion des suggestions
const handleInput = () => {
  selectedSuggestionIndex.value = -1
  
  // Debounce pour éviter trop de requêtes
  if (suggestionsTimeout) {
    clearTimeout(suggestionsTimeout)
  }
  
  suggestionsTimeout = setTimeout(() => {
    if (searchTerm.value.trim().length >= 2) {
      rechercherSuggestions(searchTerm.value)
    } else {
      masquerSuggestions()
    }
  }, 300) // 300ms de délai
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!suggestionsVisible.value || suggestions.value.length === 0) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
    case 'Enter':
      if (selectedSuggestionIndex.value >= 0) {
        event.preventDefault()
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
      }
      break
    case 'Escape':
      masquerSuggestions()
      break
  }
}

const handleFocus = () => {
  if (searchTerm.value.trim().length >= 2) {
    rechercherSuggestions(searchTerm.value)
  }
}

const handleBlur = () => {
  // Délai pour permettre le clic sur une suggestion
  setTimeout(() => {
    masquerSuggestions()
  }, 150)
}

const selectSuggestion = (suggestion: any) => {
  searchTerm.value = selectionnerSuggestion(suggestion)
  handleSearch()
}

// Méthodes
const handleSearch = async () => {
  if (!searchTerm.value.trim()) return
  
  console.log('🔍 [PAGE] Début recherche depuis la page Maux:', searchTerm.value)
  console.log('👤 [PAGE] Profil actuel:', currentProfil.value)
  
  // Mettre à jour l'URL avec le terme de recherche
  updateSearchUrl(searchTerm.value)
  
  try {
    console.log('📡 [PAGE] Appel rechercherAvecProfilActuel')
    await rechercherAvecProfilActuel(searchTerm.value)
    console.log('✅ [PAGE] Recherche terminée avec succès')
  } catch (err: any) {
    console.error('❌ [PAGE] Erreur recherche:', err)
    console.error('❌ [PAGE] Détails erreur:', {
      statusCode: err.statusCode,
      statusMessage: err.statusMessage,
      message: err.message
    })
    // Afficher un message d'erreur plus spécifique selon le type d'erreur
    // L'erreur sera gérée par le composable useMaux
  }
}

const searchSuggestion = (suggestion: string) => {
  searchTerm.value = suggestion
  handleSearch()
}

const resetSearch = () => {
  searchTerm.value = ''
  resetRecherche()
  // Nettoyer l'URL
  updateSearchUrl('')
}

// Mettre à jour l'URL avec le terme de recherche
const updateSearchUrl = (query: string) => {
  const router = useRouter()
  router.push({ 
    path: '/maux', 
    query: query ? { q: query } : {} 
  })
}

// Meta données pour le SEO
useSeoMeta({
  title: 'Recherche de Remèdes - Wonder Wo',
  ogTitle: 'Recherche de Remèdes - Wonder Wo',
  description: 'Trouvez des remèdes naturels personnalisés selon vos symptômes et votre profil.',
  ogDescription: 'Trouvez des remèdes naturels personnalisés selon vos symptômes et votre profil.',
})
</script>

<style scoped>
/* Animations fluides */
.transition-all {
  transition: all 0.3s ease;
}

/* Animation pour les badges */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

/* Style pour les filtres actifs */
.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}

/* Hover effects */
.group:hover .group-hover\:text-primary {
  color: var(--color-primary);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Loading state */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Badge prioritaire animation */
.badge-priority {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(45, 90, 39, 0.5);
  }
  to {
    box-shadow: 0 0 10px rgba(45, 90, 39, 0.8);
  }
}

/* Suggestions d'autocomplétion */
.suggestions-enter-active, .suggestions-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.suggestions-enter-from, .suggestions-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mise en évidence des termes recherchés */
:deep(mark) {
  background-color: rgba(var(--color-primary-rgb), 0.2);
  color: var(--color-primary);
  font-weight: 600;
  padding: 0;
}

/* Spinner pour les suggestions */
.suggestions-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .flex-wrap {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flex-wrap > * {
    margin-bottom: 0.5rem;
  }
}
</style>