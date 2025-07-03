<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <NuxtLink 
              to="/admin" 
              class="text-grey-black/60 hover:text-primary transition-colors"
            >
              Administration
            </NuxtLink>
            <span class="text-grey-black/40">></span>
            <span class="text-grey-black font-medium">Gestion des produits</span>
          </div>
          <h1 class="text-3xl font-bold text-grey-black">Gestion des produits</h1>
          <p class="text-grey-black/60">Modifier les fiches produits et leurs informations</p>
        </div>
      </div>

      <!-- Barre de recherche et filtres -->
      <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchTerm"
                @input="debouncedSearch"
                type="text"
                placeholder="Rechercher par nom, famille, propriétés..."
                class="w-full pl-10 pr-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 text-grey-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-grey-black/60">
              {{ adminProducts.getTotalProducts }} produit(s) trouvé(s)
            </div>
            <button
              @click="refreshProducts"
              :disabled="adminProducts.loading.value"
              class="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Grille des produits -->
      <div class="bg-blanc rounded-2xl border border-beige shadow-sm overflow-hidden">
        <!-- Loading state -->
        <div v-if="adminProducts.loading.value" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-grey-black/60">Chargement des produits...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="adminProducts.error.value" class="p-8 text-center">
          <div class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 max-w-md mx-auto">
            <p class="text-secondary text-sm font-medium mb-3">{{ adminProducts.error.value }}</p>
            <button 
              @click="refreshProducts"
              class="text-primary hover:underline text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Grille des produits -->
        <div v-else-if="adminProducts.products.value.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="product in adminProducts.products.value" 
              :key="product.id"
              class="bg-beige/20 p-6 rounded-xl border border-beige hover:shadow-md transition-all cursor-pointer"
              @click="openEditModal(product)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span class="text-2xl">{{ product.imageUrl }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-grey-black">{{ product.nom }}</h3>
                    <p class="text-sm text-grey-black/60 italic">{{ product.nomScientifique }}</p>
                  </div>
                </div>
                <span class="text-xs text-grey-black/40">#{{ product.id }}</span>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-grey-black/60">Famille:</span>
                  <span class="font-medium">{{ product.famille }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-grey-black/60">Partie:</span>
                  <span class="font-medium">{{ product.partie }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-grey-black/60">Forme:</span>
                  <span class="font-medium">{{ adminProducts.getFormeGaleniqueLabel(product.formeGalenique) }}</span>
                </div>
              </div>

              <div class="mb-4">
                <p class="text-xs text-grey-black/60 mb-1">Propriétés principales:</p>
                <p class="text-sm text-grey-black line-clamp-2">{{ product.proprietesPrincipales }}</p>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-grey-black/40">
                  {{ formatDate(product.updatedAt) }}
                </span>
                <button
                  @click.stop="openEditModal(product)"
                  class="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="p-8 text-center">
          <div class="w-16 h-16 bg-grey-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🌿</span>
          </div>
          <h3 class="text-lg font-semibold text-grey-black mb-2">Aucun produit trouvé</h3>
          <p class="text-grey-black/60 mb-4">
            {{ searchTerm ? 'Aucun produit ne correspond à votre recherche.' : 'Aucun produit n\'est encore enregistré.' }}
          </p>
          <button 
            v-if="searchTerm"
            @click="clearSearch"
            class="text-primary hover:underline text-sm"
          >
            Effacer la recherche
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div 
        v-if="adminProducts.products.value.length > 0 && adminProducts.getTotalPages.value > 1" 
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-sm text-grey-black/60">
          Page {{ adminProducts.pagination.value.page }} sur {{ adminProducts.getTotalPages }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="previousPage"
            :disabled="!adminProducts.hasPreviousPage.value || adminProducts.loading.value"
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="!adminProducts.hasNextPage.value || adminProducts.loading.value"
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-grey-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-blanc rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-grey-black">Modifier le produit</h2>
          <button
            @click="closeEditModal"
            class="text-grey-black/40 hover:text-grey-black transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- Informations de base -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Nom commun *
              </label>
              <input
                v-model="editForm.nom"
                type="text"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Nom scientifique *
              </label>
              <input
                v-model="editForm.nomScientifique"
                type="text"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Famille botanique *
              </label>
              <input
                v-model="editForm.famille"
                type="text"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Partie utilisée *
              </label>
              <input
                v-model="editForm.partie"
                type="text"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">
              Forme galénique
            </label>
            <select
              v-model="editForm.formeGalenique"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option 
                v-for="option in adminProducts.getFormeGaleniqueOptions()" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">
              Composition *
            </label>
            <textarea
              v-model="editForm.composition"
              required
              rows="3"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Propriétés principales
              </label>
              <textarea
                v-model="editForm.proprietesPrincipales"
                rows="2"
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-grey-black mb-2">
                Propriétés secondaires
              </label>
              <textarea
                v-model="editForm.proprietesSecondaires"
                rows="2"
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              ></textarea>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">
              Utilisation
            </label>
            <textarea
              v-model="editForm.utilisation"
              rows="3"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">
              Précautions
            </label>
            <textarea
              v-model="editForm.precautions"
              rows="3"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-grey-black mb-2">
              Source
            </label>
            <input
              v-model="editForm.source"
              type="text"
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-4 pt-4 border-t border-beige">
            <button
              type="button"
              @click="closeEditModal"
              class="px-6 py-3 border border-beige text-grey-black rounded-xl font-medium hover:bg-beige/50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-3 bg-primary text-blanc rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
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
const adminProducts = useAdminProducts()

// État réactif
const searchTerm = ref('')
const showEditModal = ref(false)
const saving = ref(false)
const editingProduct = ref<any>(null)

const editForm = ref({
  nom: '',
  nomScientifique: '',
  famille: '',
  partie: '',
  composition: '',
  formeGalenique: 1,
  proprietesPrincipales: '',
  proprietesSecondaires: '',
  utilisation: '',
  precautions: '',
  source: '',
  imageUrl: '🌿'
})

// Fonctions utilitaires
const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// Recherche avec debounce simple
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      await adminProducts.searchProducts(searchTerm.value.trim())
    } else {
      await adminProducts.loadProducts()
    }
  }, 300)
}

// Actions
const refreshProducts = async () => {
  await adminProducts.loadProducts()
}

const clearSearch = async () => {
  searchTerm.value = ''
  await adminProducts.loadProducts()
}

const previousPage = async () => {
  const currentPage = adminProducts.pagination.value.page
  if (currentPage > 1) {
    await adminProducts.loadPage(currentPage - 1)
  }
}

const nextPage = async () => {
  const currentPage = adminProducts.pagination.value.page
  const totalPages = adminProducts.getTotalPages.value
  if (currentPage < totalPages) {
    await adminProducts.loadPage(currentPage + 1)
  }
}

// Modal d'édition
const openEditModal = (product: any) => {
  editingProduct.value = product
  editForm.value = {
    nom: product.nom,
    nomScientifique: product.nomScientifique,
    famille: product.famille,
    partie: product.partie,
    composition: product.composition,
    formeGalenique: product.formeGalenique,
    proprietesPrincipales: product.proprietesPrincipales,
    proprietesSecondaires: product.proprietesSecondaires,
    utilisation: product.utilisation,
    precautions: product.precautions,
    source: product.source,
    imageUrl: product.imageUrl
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingProduct.value = null
  editForm.value = {
    nom: '',
    nomScientifique: '',
    famille: '',
    partie: '',
    composition: '',
    formeGalenique: 1,
    proprietesPrincipales: '',
    proprietesSecondaires: '',
    utilisation: '',
    precautions: '',
    source: '',
    imageUrl: '🌿'
  }
}

const saveProduct = async () => {
  if (!editingProduct.value) return
  
  saving.value = true
  try {
    await adminProducts.updateProduct(editingProduct.value.id, editForm.value)
    closeEditModal()
    await refreshProducts()
  } catch (error) {
    console.error('Erreur sauvegarde produit:', error)
  } finally {
    saving.value = false
  }
}

// Charger les produits au montage
onMounted(async () => {
  await adminProducts.loadProducts()
})

// Meta données pour le SEO
useSeoMeta({
  title: 'Gestion des produits - Administration Wonder Wo',
  description: 'Interface d\'administration pour gérer les produits',
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

/* Animation de rotation pour le spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 