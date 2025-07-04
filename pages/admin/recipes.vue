<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- En-tête -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-grey-black mb-2">Gestion des Recettes</h1>
            <p class="text-grey-black/60">Gérer les recettes de remèdes naturels</p>
          </div>
          <NuxtLink 
            to="/admin" 
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors"
          >
            ← Retour admin
          </NuxtLink>
        </div>
      </div>

      <!-- Barre de recherche et statistiques -->
      <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Recherche -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchInput"
                @input="debouncedSearch"
                type="text"
                placeholder="Rechercher une recette..."
                class="w-full pl-10 pr-4 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-grey-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>



          <!-- Statistiques -->
          <div class="flex items-center gap-6 text-sm text-grey-black/60">
            <span>Total: <strong class="text-grey-black">{{ stats.total }}</strong></span>
            <span>Page: <strong class="text-grey-black">{{ stats.currentPage }}/{{ stats.totalPages }}</strong></span>
          </div>
        </div>

      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-between">
          <p class="text-secondary font-medium">{{ error }}</p>
          <button @click="clearError" class="text-secondary hover:text-secondary/80">✕</button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading && recipes.length === 0" class="bg-blanc p-8 rounded-2xl border border-beige text-center">
        <div class="animate-pulse">
          <div class="h-4 bg-beige rounded w-1/4 mx-auto mb-4"></div>
          <div class="h-3 bg-beige rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Table des recettes -->
      <div v-else class="bg-blanc overflow-hidden">
        <!-- En-tête du tableau -->
        <div class="bg-beige/30 px-6 py-4 border-b border-beige">
          <h3 class="text-lg font-semibold text-grey-black">
            Recettes ({{ stats.showing }} sur {{ stats.total }})
          </h3>
        </div>

        <!-- Contenu du tableau -->
        <div v-if="recipes.length === 0" class="p-8 text-center text-grey-black/60">
          <p>Aucune recette trouvée</p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div 
            v-for="recipe in recipes" 
            :key="recipe.id"
            class="p-6 hover:bg-beige/20 transition-colors rounded-2xl border border-primary/20 shadow-sm"
          >
            <div class="flex items-start justify-between">
              <!-- Informations principales -->
              <div class="flex-1 min-w-0 mr-6">
                                 <div class="flex items-center gap-3 mb-3">
                   <h4 class="text-lg font-semibold text-grey-black truncate">
                     {{ getRecipeTitle(recipe) }}
                   </h4>
                  <span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {{ getTypeRemedLabel(recipe.type_remede) }}
                  </span>
                  <span class="bg-beige text-grey-black px-2 py-1 rounded-full text-xs">
                    {{ getTypeApplicationLabel(recipe.type_application) }}
                  </span>
                </div>

                <p class="text-grey-black/70 mb-3 line-clamp-2">{{ recipe.recette }}</p>

                <div class="flex flex-wrap gap-2 mb-3">
                  <span class="bg-primary/5 text-primary px-2 py-1 rounded text-xs">
                    {{ getTrancheAgeLabel(recipe.tranche_age) }}
                  </span>
                  <span 
                    v-if="recipe.femme_enceinte" 
                    class="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs"
                  >
                    🤱 Femme enceinte
                  </span>
                  <span 
                    v-if="recipe.efficacite" 
                    class="bg-beige text-grey-black px-2 py-1 rounded text-xs"
                  >
                    Efficacité: {{ recipe.efficacite }}/5
                  </span>
                </div>

                <!-- Note moyenne -->
                <div v-if="(recipe as any).rating && (recipe as any).rating.ratings_count > 0" class="mb-3">
                  <div class="flex items-center gap-2">
                    <div class="flex">
                      <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                        {{ i <= Math.round((recipe as any).rating.average_rating) ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="text-xs text-grey-black/60">
                      {{ (recipe as any).rating.average_rating.toFixed(1) }} ({{ (recipe as any).rating.ratings_count }} avis)
                    </span>
                  </div>
                </div>

                <!-- Produits et maux associés -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div v-if="recipe.produits.length > 0">
                    <p class="font-medium text-grey-black mb-1">Produits:</p>
                    <div class="flex flex-wrap gap-1">
                                             <span 
                         v-for="produit in recipe.produits.slice(0, 3)" 
                         :key="produit.id"
                         class="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                       >
                         {{ produit.Nom_Commun }}
                       </span>
                      <span 
                        v-if="recipe.produits.length > 3"
                        class="text-grey-black/60 text-xs"
                      >
                        +{{ recipe.produits.length - 3 }}
                      </span>
                    </div>
                  </div>
                  
                  <div v-if="recipe.maux.length > 0">
                    <p class="font-medium text-grey-black mb-1">Maux traités:</p>
                    <div class="flex flex-wrap gap-1">
                                             <span 
                         v-for="mal in recipe.maux.slice(0, 3)" 
                         :key="mal.id"
                         class="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs"
                       >
                         {{ mal.Symptom }}
                       </span>
                      <span 
                        v-if="recipe.maux.length > 3"
                        class="text-grey-black/60 text-xs"
                      >
                        +{{ recipe.maux.length - 3 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  @click="openEditModal(recipe)"
                  class="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-beige/30 px-6 py-4 border-t border-beige">
          <div class="flex items-center justify-between">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="bg-blanc border border-beige text-grey-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>

            <div class="flex items-center gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="typeof page === 'number' ? goToPage(page) : void 0"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary text-blanc'
                    : 'bg-blanc border border-beige text-grey-black hover:bg-beige/50'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="bg-blanc border border-beige text-grey-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-blanc rounded-2xl border border-beige shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-beige">
          <h3 class="text-xl font-semibold text-grey-black">
            Modifier : {{ editingRecipe ? getRecipeTitle(editingRecipe) : 'Recette' }}
          </h3>
        </div>

        <!-- Onglets -->
        <div class="border-b border-beige px-6">
          <nav class="flex space-x-8">
            <button
              @click="activeTab = 'info'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'info'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-grey-black/60 hover:text-grey-black hover:border-grey-black/20'
              ]"
            >
              Informations
            </button>
            <button
              @click="activeTab = 'comments'"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'comments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-grey-black/60 hover:text-grey-black hover:border-grey-black/20'
              ]"
            >
              Commentaires
            </button>
          </nav>
        </div>

        <!-- Contenu de l'onglet Informations -->
        <div v-if="activeTab === 'info'">
          <form @submit.prevent="saveRecipe" class="p-6 space-y-6">
          <!-- Type de remède -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Type de remède</label>
            <select
              v-model="editForm.type_remede"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option v-for="option in typeRemedOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Type d'application -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Type d'application</label>
            <select
              v-model="editForm.type_application"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option v-for="option in typeApplicationOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Recette -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Recette</label>
            <textarea
              v-model="editForm.recette"
              rows="4"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Description de la recette..."
            ></textarea>
          </div>

          <!-- Tranche d'âge -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Tranche d'âge</label>
            <select
              v-model="editForm.tranche_age"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option v-for="option in trancheAgeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Femme enceinte -->
          <div>
            <label class="flex items-center">
              <input
                v-model="editForm.femme_enceinte"
                type="checkbox"
                class="rounded border-beige text-primary focus:ring-primary"
              />
              <span class="ml-2 text-sm font-medium text-grey-black">Adapté aux femmes enceintes</span>
            </label>
          </div>

          <!-- Source documentaire -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Source documentaire</label>
            <input
              v-model="editForm.source_documentaire"
              type="text"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Source de la recette..."
            />
          </div>

          <!-- Efficacité -->
          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">Efficacité (1-5)</label>
            <input
              v-model.number="editForm.efficacite"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-beige">
            <button
              type="button"
              @click="closeEditModal"
              class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg font-medium hover:bg-beige/50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-blanc px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span v-if="loading">Sauvegarde...</span>
              <span v-else>Sauvegarder</span>
            </button>
          </div>
        </form>
        </div>

        <!-- Contenu de l'onglet Commentaires -->
        <div v-else-if="activeTab === 'comments' && editingRecipe">
          <div class="p-6">
            <CommentsSection 
              entity-type="recette" 
              :entity-id="editingRecipe.id"
            />
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
  middleware: 'admin'
})

// Composables
const {
  recipes,
  loading,
  error,
  searchTerm,
  currentPage,
  totalPages,
  stats,
  loadRecipes,
  searchRecipes,
  goToPage,
  updateRecipe,
  clearError,
  typeRemedOptions,
  typeApplicationOptions,
  trancheAgeOptions,
  getTypeRemedLabel,
  getTypeApplicationLabel,
  getTrancheAgeLabel
} = useAdminRecipes()

// État local
const searchInput = ref('')
const showEditModal = ref(false)
const editingRecipe = ref<any>(null)
const activeTab = ref('info')
const editForm = ref({
  type_remede: 1,
  type_application: 1,
  recette: '',
  tranche_age: 4,
  femme_enceinte: false,
  source_documentaire: '',
  efficacite: null as number | null
})





// Recherche avec debounce
let searchTimeout: any = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchRecipes(searchInput.value)
  }, 300)
}

// Pagination visible
const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const delta = 2
  const range = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) {
    range.push(total)
  }
  
  return range.filter((item, index, array) => array.indexOf(item) === index)
})

// Ouvrir le modal d'édition
const openEditModal = (recipe: any) => {
  editingRecipe.value = recipe
  editForm.value = {
    type_remede: recipe.type_remede,
    type_application: recipe.type_application,
    recette: recipe.recette,
    tranche_age: recipe.tranche_age,
    femme_enceinte: recipe.femme_enceinte,
    source_documentaire: recipe.source_documentaire,
    efficacite: recipe.efficacite
  }
  showEditModal.value = true
}

// Fermer le modal d'édition
const closeEditModal = () => {
  showEditModal.value = false
  editingRecipe.value = null
  activeTab.value = 'info'
}

// Créer un titre intelligent pour la recette
const getRecipeTitle = (recipe: any) => {
  const typeLabel = getTypeRemedLabel(recipe.type_remede)
  
  // Essayer d'extraire un nom depuis le début de la recette
  const recetteText = recipe.recette || ''
  const firstSentence = recetteText.split(':')[0] || recetteText.split('.')[0]
  
  if (firstSentence && firstSentence.length > 10 && firstSentence.length < 50) {
    return firstSentence.trim()
  }
  
  // Si on a des produits, créer un titre basé sur eux
  if (recipe.produits && recipe.produits.length > 0) {
    const produitNames = recipe.produits.slice(0, 2).map((p: any) => p.Nom_Commun).join(' & ')
    return `${typeLabel} - ${produitNames}${recipe.produits.length > 2 ? '...' : ''}`
  }
  
  // Fallback avec le type de remède
  return `${typeLabel} #${recipe.id}`
}

// Sauvegarder les modifications
const saveRecipe = async () => {
  if (!editingRecipe.value) return
  
  try {
    await updateRecipe(editingRecipe.value.id, editForm.value)
    closeEditModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Charger les données au montage
onMounted(async () => {
  await loadRecipes()
})

// Meta données
useSeoMeta({
  title: 'Gestion des Recettes - Administration Wonder Wo',
  description: 'Interface d\'administration pour gérer les recettes de remèdes naturels',
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 