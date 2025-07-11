<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <!-- Header avec navigation -->
      <div class="flex items-center justify-between mb-6 sm:mb-8">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors p-2 -ml-2 rounded-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="font-medium text-sm sm:text-base">Retour aux résultats</span>
        </button>
        
        <div class="hidden md:block text-center flex-1 mx-4">
          <h1 class="text-xl sm:text-2xl font-bold">Wonder Wo</h1>
          <p class="text-xs sm:text-sm text-grey-black/60">Détail du remède</p>
        </div>
        
        <div class="w-8 sm:w-24"></div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8 sm:py-12">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
        </div>
        <p class="text-grey-black/60 text-sm sm:text-base">Chargement du remède...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 sm:p-6 text-center">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-xl sm:text-2xl">⚠️</span>
        </div>
        <h3 class="text-base sm:text-lg font-semibold text-secondary mb-2">Erreur</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">{{ error }}</p>
        <button @click="goBack" class="secondary-btn text-sm sm:text-base">
          Retour
        </button>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="remede" class="space-y-6 sm:space-y-8">
        <!-- En-tête du remède -->
        <div class="bg-primary/5 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-primary/20">
          <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <!-- Image du produit -->
            <div class="w-full max-w-xs mx-auto lg:mx-0 lg:w-1/3">
              <div class="md:aspect-square h-[150px] md:h-auto md:max-h-none bg-blanc rounded-2xl border border-beige overflow-hidden flex items-center justify-center">
                <span class="text-6xl">{{ getRecipeImage() }}</span>
              </div>
            </div>
            <!-- Informations principales -->
            <div class="lg:w-2/3 text-center lg:text-left">
              <div class="mb-4 sm:mb-6">
                <h2 class="text-2xl sm:text-3xl font-bold text-grey-black mb-2">
                  {{ getRecipeTitle() }}
                </h2>
                <p class="text-base sm:text-lg text-grey-black/70 italic mb-3 sm:mb-4">
                  {{ getTypeRemede(remede.Type_Remede) }}
                </p>
                
                <!-- Note moyenne -->
                <div v-if="commentsStats.ratings_count > 0" class="flex items-center gap-3 mb-3 sm:mb-4 justify-center lg:justify-start">
                  <div class="flex items-center gap-1">
                    <div class="flex">
                      <span v-for="i in 5" :key="i" class="text-yellow-400 text-lg">
                        {{ i <= Math.round(commentsStats.average_rating) ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="text-sm text-grey-black/70 font-medium">
                      {{ commentsStats.average_rating.toFixed(1) }}/5
                    </span>
                  </div>
                  <span class="text-sm text-grey-black/60">
                    ({{ commentsStats.ratings_count }} {{ commentsStats.ratings_count === 1 ? 'avis' : 'avis' }})
                  </span>
                </div>
                
                <!-- Tags informatifs -->
                <div class="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center lg:justify-start">
                  <span class="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    {{ getTypeRemede(remede.Type_Remede) }}
                  </span>
                  <span class="bg-beige text-grey-black text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    {{ getTypeApplication(remede.Type_Application) }}
                  </span>
                  <span v-if="remede.Efficacite" class="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    Efficacité: {{ remede.Efficacite }}/5
                  </span>
                </div>
              </div>
              <!-- Propriétés principales -->
              <div class="grid gap-3 sm:gap-4">
                <div v-if="produits && produits.length > 0" class="bg-blanc/70 p-3 sm:p-4 rounded-xl">
                  <h4 class="font-semibold text-grey-black mb-1 sm:mb-2 text-sm sm:text-base">Propriété principale</h4>
                  <p class="text-xs sm:text-sm text-grey-black/70">{{ produits[0]?.Propriete_Principale || 'Non spécifiée' }}</p>
                </div>
                <div v-if="produits && produits.length > 0" class="bg-blanc/70 p-3 sm:p-4 rounded-xl">
                  <h4 class="font-semibold text-grey-black mb-1 sm:mb-2 text-sm sm:text-base">Propriétés secondaires</h4>
                  <p class="text-xs sm:text-sm text-grey-black/70">{{ produits[0]?.Propriete_Secondaire || 'Non spécifiées' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recette détaillée -->
        <div class="bg-blanc p-4 sm:p-6 lg:p-8 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center gap-3 mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span class="text-lg sm:text-2xl">📋</span>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold">Recette et préparation</h3>
              <p class="text-xs sm:text-sm text-grey-black/60">Mode d'emploi détaillé</p>
            </div>
          </div>
          <div class="prose max-w-none">
            <div class="bg-beige/30 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
              <h4 class="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Instructions de préparation</h4>
              <p class="text-grey-black/80 leading-relaxed text-sm sm:text-base">
                {{ remede.Recette }}
              </p>
            </div>
            <!-- Informations sur l'application -->
            <div class="grid gap-4 sm:gap-6">
              <div class="bg-primary/5 p-3 sm:p-4 rounded-xl">
                <h5 class="font-semibold text-primary mb-1 sm:mb-2 text-sm sm:text-base">Type d'application</h5>
                <p class="text-xs sm:text-sm">{{ getTypeApplication(remede.Type_Application) }}</p>
              </div>
              <div class="bg-primary/5 p-3 sm:p-4 rounded-xl">
                <h5 class="font-semibold text-primary mb-1 sm:mb-2 text-sm sm:text-base">Type de remède</h5>
                <p class="text-xs sm:text-sm">{{ getTypeRemede(remede.Type_Remede) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Produits nécessaires -->
        <div v-if="produits && produits.length > 0" class="bg-blanc p-4 sm:p-6 lg:p-8 rounded-2xl border border-beige shadow-sm">
          <div class="flex items-center gap-3 mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span class="text-lg sm:text-2xl">🌿</span>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold">Produits nécessaires</h3>
              <p class="text-xs sm:text-sm text-grey-black/60">Ingrédients requis pour cette recette</p>
            </div>
          </div>
          
          <div class="grid gap-3 sm:gap-4">
            <div 
              v-for="produit in produits" 
              :key="produit.id"
              class="bg-beige/20 p-3 sm:p-4 rounded-xl border border-beige/40 hover:bg-beige/30 transition-colors"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <h4 class="font-semibold text-grey-black text-sm sm:text-base">{{ produit.Nom_Commun }}</h4>
                  <div 
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      produit.inPlacard 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    ]"
                  >
                    {{ produit.inPlacard ? '✓ Dans le placard' : '○ Manquant' }}
                  </div>
                </div>
                <button
                  v-if="!produit.inPlacard"
                  @click="addToPlacard(produit.id)"
                  :disabled="addingToPlacard"
                  class="bg-primary text-blanc px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-none"
                >
                  {{ addingToPlacard ? 'Ajout...' : 'Ajouter' }}
                </button>
              </div>
              
              <p class="text-grey-black/70 italic text-xs sm:text-sm mb-2">{{ produit.Nom_Scientifique }}</p>
              
              <div class="grid gap-2 sm:gap-3">
                <div class="flex flex-wrap gap-2">
                  <span class="bg-blanc/70 px-2 py-1 rounded text-xs">{{ produit.Famille_Botanique }}</span>
                  <span class="bg-blanc/70 px-2 py-1 rounded text-xs">{{ produit.Partie_Plante }}</span>
                </div>
                
                <div class="text-xs sm:text-sm">
                  <p class="text-grey-black/80 mb-1"><strong>Propriétés :</strong> {{ produit.Propriete_Principale }}</p>
                  <p class="text-grey-black/60">{{ produit.Propriete_Secondaire }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Résumé des produits -->
          <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-grey-black">Statut du placard</p>
                <p class="text-xs text-grey-black/60">{{ produitsDansPlacard }} / {{ produits.length }} produits disponibles</p>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold" :class="allProduitsInPlacard ? 'text-primary' : 'text-secondary'">
                  {{ allProduitsInPlacard ? '✓' : '○' }}
                </div>
                <p class="text-xs" :class="allProduitsInPlacard ? 'text-primary' : 'text-secondary'">
                  {{ allProduitsInPlacard ? 'Complet' : 'Incomplet' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Utilisation et efficacité -->
        <div class="grid gap-4 sm:gap-6 lg:gap-8">
          <div class="bg-blanc p-4 sm:p-6 rounded-2xl border border-beige">
            <div class="flex items-center gap-3 mb-3 sm:mb-4">
              <span class="text-lg sm:text-2xl">💡</span>
              <h3 class="text-base sm:text-lg font-semibold">Conseils d'utilisation</h3>
            </div>
            <p class="text-grey-black/80 text-xs sm:text-sm leading-relaxed">
              {{ produits && produits.length > 0 ? produits[0]?.Utilisation : 'Suivre les instructions de la recette ci-dessus.' }}
            </p>
          </div>
        </div>

        <!-- Précautions et informations importantes -->
        <div class="bg-secondary/5 border border-secondary/20 p-4 sm:p-6 rounded-2xl">
          <div class="flex items-start gap-3 mb-3 sm:mb-4">
            <span class="text-lg sm:text-2xl">⚠️</span>
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-secondary">Précautions d'emploi</h3>
              <p class="text-xs sm:text-sm text-secondary/70">Informations importantes à lire avant utilisation</p>
            </div>
          </div>
          <div class="space-y-3 sm:space-y-4">
            <div class="bg-blanc/70 p-3 sm:p-4 rounded-xl">
              <p class="text-xs sm:text-sm text-grey-black/80 leading-relaxed">
                {{ produits && produits.length > 0 ? produits[0]?.Precautions : 'Respecter les dosages recommandés et consulter un professionnel de santé en cas de doute.' }}
              </p>
            </div>
            <!-- Informations sur l'âge et grossesse -->
            <div class="grid gap-3 sm:gap-4">
              <div class="flex items-center gap-3 p-3 bg-blanc/70 rounded-xl">
                <span class="text-base sm:text-lg">👶</span>
                <div>
                  <p class="font-medium text-xs sm:text-sm">Tranche d'âge</p>
                  <p class="text-xs text-grey-black/60">{{ getTrancheAge(remede.Tranche_age) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-blanc/70 rounded-xl">
                <span class="text-base sm:text-lg">🤱</span>
                <div>
                  <p class="font-medium text-xs sm:text-sm">Femmes enceintes</p>
                  <p class="text-xs text-grey-black/60">
                    {{ remede.Femme_Enceinte ? 'Autorisé' : 'Non recommandé' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Source et fiabilité -->
        <div class="bg-beige/30 p-4 sm:p-6 rounded-2xl border border-beige">
          <div class="flex items-center gap-3 mb-3 sm:mb-4">
            <span class="text-lg sm:text-2xl">📚</span>
            <h3 class="text-base sm:text-lg font-semibold">Sources et références</h3>
          </div>
          <div class="grid gap-3 sm:gap-4">
            <div>
              <p class="text-xs sm:text-sm font-medium text-grey-black mb-1">Source principale</p>
              <p class="text-xs text-grey-black/70">{{ produits && produits.length > 0 ? produits[0]?.Source : 'Non spécifiée' }}</p>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-grey-black mb-1">Documentation</p>
              <p class="text-xs text-grey-black/70">{{ remede.Source_Documentaire || 'Non spécifiée' }}</p>
            </div>
          </div>
        </div>

        <!-- Section commentaires -->
        <div v-if="remede" class="mt-8">
          <CommentsSection 
            entity-type="recette" 
            :entity-id="remede.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { getRecetteById, enrichProduitsWithPlacardStatus } = useRecette()
const { addToPlacard: addToPlacardAction } = usePlacard()

// Composable pour les commentaires et notes
const {
  stats: commentsStats,
  loadComments
} = useComments()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const remede = ref<any>(null)
const produits = ref<any[]>([])
const addingToPlacard = ref(false)

// Computed properties pour le statut des produits
const produitsDansPlacard = computed(() => {
  return produits.value.filter(p => p.inPlacard).length
})

const allProduitsInPlacard = computed(() => {
  return produits.value.length > 0 && produits.value.every(p => p.inPlacard)
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const recetteId = Number(route.params.id)
    if (isNaN(recetteId)) {
      throw new Error('Identifiant de recette invalide')
    }
    const data = await getRecetteById(recetteId)
    if (!data) {
      throw new Error('Recette non trouvée')
    }
    remede.value = data
    
    // Enrichir les produits avec leur statut dans le placard
    if (data.produits && data.produits.length > 0) {
      produits.value = await enrichProduitsWithPlacardStatus(data.produits)
    }
    
    // Charger les statistiques des commentaires
    try {
      await loadComments('recette', data.id)
    } catch (commentError) {
      console.error('Erreur lors du chargement des stats commentaires:', commentError)
    }
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})

// Fonction pour ajouter un produit au placard
const addToPlacard = async (produitId: number) => {
  addingToPlacard.value = true
  try {
    await addToPlacardAction(produitId)
    
    // Mettre à jour le statut local du produit
    const produitIndex = produits.value.findIndex(p => p.id === produitId)
    if (produitIndex !== -1) {
      produits.value[produitIndex].inPlacard = true
    }
    
  } catch (err: any) {
    console.error('Erreur lors de l\'ajout au placard:', err)
    // Optionnel: afficher une notification d'erreur
  } finally {
    addingToPlacard.value = false
  }
}

function goBack() {
  router.back()
}

// Fonction utilitaire pour afficher la tranche d'âge
function getTrancheAge(tranche: string | number | undefined): string {
  if (!tranche) return 'Non spécifiée'
  
  if (typeof tranche === 'string') {
    switch (tranche.toLowerCase()) {
      case 'adulte':
        return 'Adulte (18+ ans)'
      case 'enfant':
        return 'Enfant (3-17 ans)'
      case 'bebe':
        return 'Bébé (0-3 ans)'
      default:
        return String(tranche)
    }
  }
  
  // Gestion des valeurs numériques
  switch (Number(tranche)) {
    case 1:
      return 'Adulte (18+ ans)'
    case 2:
      return 'Enfant (3-17 ans)'
    case 3:
      return 'Bébé (0-3 ans)'
    default:
      return String(tranche)
  }
}

// Fonction utilitaire pour afficher le type d'application
function getTypeApplication(type: string | number | undefined): string {
  if (!type) return 'Non spécifié'
  
  if (typeof type === 'string') {
    switch (type.toLowerCase()) {
      case 'diffusion':
        return 'Diffusion atmosphérique'
      case 'massage':
        return 'Application cutanée'
      case 'oral':
        return 'Voie orale'
      default:
        return String(type)
    }
  }
  
  // Gestion des valeurs numériques
  switch (Number(type)) {
    case 1:
      return 'Diffusion atmosphérique'
    case 2:
      return 'Application cutanée'
    case 3:
      return 'Voie orale'
    default:
      return String(type)
  }
}

// Fonction utilitaire pour afficher le type de remède
function getTypeRemede(type: string | number | undefined): string {
  if (!type) return 'Non spécifié'
  
  if (typeof type === 'string') {
    switch (type.toLowerCase()) {
      case 'melange':
        return 'Mélange d\'huiles essentielles'
      case 'huile':
        return 'Huile essentielle pure'
      case 'infusion':
        return 'Infusion de plantes'
      default:
        return String(type)
    }
  }
  
  // Gestion des valeurs numériques
  switch (Number(type)) {
    case 1:
      return 'Mélange d\'huiles essentielles'
    case 2:
      return 'Huile essentielle pure'
    case 3:
      return 'Infusion de plantes'
    default:
      return String(type)
  }
}

// Props
const props = defineProps<{
  remedeId: number
}>()

// Computed property for the recipe title
const getRecipeTitle = () => {
  if (!remede.value) return 'Remède'
  
  const typeRemede = getTypeRemede(remede.value.Type_Remede)
  const typeApplication = getTypeApplication(remede.value.Type_Application)
  
  return `${typeRemede} - ${typeApplication}`
}

// Computed property for the recipe image
const getRecipeImage = () => {
  // Utiliser l'image du premier produit si disponible
  if (produits.value && produits.value.length > 0 && produits.value[0]?.Image_url) {
    return produits.value[0].Image_url
  }
  
  // Sinon, utiliser une icône contextuelle basée sur le type d'application/remède
  if (!remede.value) return '🌿'
  
  // Icônes basées sur le type d'application
  switch (remede.value.Type_Application) {
    case 1: // diffusion
    case 'diffusion':
      return '🪔'
    case 2: // massage
    case 'massage':
      return '💆'
    case 3: // oral
    case 'oral':
      return '💊'
    default:
      // Icônes basées sur le type de remède
      switch (remede.value.Type_Remede) {
        case 1: // melange
        case 'melange':
          return '🌿'
        case 2: // huile
        case 'huile':
          return '🪔'
        case 3: // infusion
        case 'infusion':
          return '☕'
        default:
          return '🌿'
      }
  }
}

</script>

<style scoped>
/* Réutilisation des styles de la page profil */

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

.prose {
  max-width: none;
}

/* Animation de rotation pour le spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Améliorations pour le touch sur mobile */
@media (max-width: 640px) {
  
  /* Amélioration de l'espacement pour les petits écrans */
  .grid {
    gap: 0.75rem;
  }
  
  /* Optimisation de la lecture sur mobile */
  p, span {
    line-height: 1.5;
  }
}

/* Responsive pour tablettes */
@media (min-width: 640px) and (max-width: 1024px) {
  .lg\:w-1\/3 {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .lg\:w-2\/3 {
    width: 100%;
  }
}
</style>