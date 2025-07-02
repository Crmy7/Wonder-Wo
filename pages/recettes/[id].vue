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
        
        <div class="text-center flex-1 mx-4">
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
            <!-- Image générique pour HE -->
            <div class="w-full max-w-xs mx-auto lg:mx-0 lg:w-1/3">
              <div class="aspect-square bg-blanc rounded-2xl border border-beige overflow-hidden flex items-center justify-center">
                <span class="text-6xl">🪔</span>
              </div>
            </div>
            <!-- Informations principales -->
            <div class="lg:w-2/3 text-center lg:text-left">
              <div class="mb-4 sm:mb-6">
                <h2 class="text-2xl sm:text-3xl font-bold text-grey-black mb-2">
                  Diffusion relaxante
                </h2>
                <p class="text-base sm:text-lg text-grey-black/70 italic mb-3 sm:mb-4">
                  Mélange d'huiles essentielles
                </p>
                <!-- Tags informatifs -->
                <div class="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center lg:justify-start">
                  <span class="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    Aromathérapie
                  </span>
                  <span class="bg-beige text-grey-black text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    {{ getTypeApplication(remede.Type_Application) }}
                  </span>
                  <span class="bg-primary/10 text-primary text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    Efficacité: {{ remede.Efficacite }}/5
                  </span>
                </div>
              </div>
              <!-- Propriétés principales -->
              <div class="grid gap-3 sm:gap-4">
                <div class="bg-blanc/70 p-3 sm:p-4 rounded-xl">
                  <h4 class="font-semibold text-grey-black mb-1 sm:mb-2 text-sm sm:text-base">Propriété principale</h4>
                  <p class="text-xs sm:text-sm text-grey-black/70">Relaxation, détente</p>
                </div>
                <div class="bg-blanc/70 p-3 sm:p-4 rounded-xl">
                  <h4 class="font-semibold text-grey-black mb-1 sm:mb-2 text-sm sm:text-base">Propriétés secondaires</h4>
                  <p class="text-xs sm:text-sm text-grey-black/70">Favorise le sommeil, réduit le stress</p>
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

        <!-- Utilisation et efficacité -->
        <div class="grid gap-4 sm:gap-6 lg:gap-8">
          <div class="bg-blanc p-4 sm:p-6 rounded-2xl border border-beige">
            <div class="flex items-center gap-3 mb-3 sm:mb-4">
              <span class="text-lg sm:text-2xl">💡</span>
              <h3 class="text-base sm:text-lg font-semibold">Conseils d'utilisation</h3>
            </div>
            <p class="text-grey-black/80 text-xs sm:text-sm leading-relaxed">
              Diffuser le mélange 30 minutes avant le coucher dans une pièce aérée. Ne pas dépasser la dose recommandée.
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
                Ne pas utiliser chez les enfants de moins de 3 ans. Aérer la pièce après diffusion. Éviter le contact avec les yeux.
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
              <p class="text-xs text-grey-black/70">Aromathérapie relaxante</p>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-grey-black mb-1">Documentation</p>
              <p class="text-xs text-grey-black/70">{{ remede.Source_Documentaire || 'Non spécifiée' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { getRecetteById } = useRecette()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const remede = ref<any>(null)

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
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

// Fonction utilitaire pour afficher la tranche d'âge
function getTrancheAge(tranche: string | number | undefined): string {
  if (!tranche) return 'Non spécifiée'
  // Ajoutez ici la logique de conversion selon vos besoins
  // Exemple simple :
  switch (tranche) {
    case 'adulte':
    case 1:
      return 'Adulte'
    case 'enfant':
    case 2:
      return 'Enfant'
    case 'bebe':
    case 3:
      return 'Bébé'
    default:
      return String(tranche)
  }
}

// Fonction utilitaire pour afficher le type d'application
function getTypeApplication(type: string | number | undefined): string {
  if (!type) return 'Non spécifié'
  switch (type) {
    case 'diffusion':
    case 1:
      return 'Diffusion'
    case 'massage':
    case 2:
      return 'Massage'
    case 'oral':
    case 3:
      return 'Voie orale'
    default:
      return String(type)
  }
}

// Fonction utilitaire pour afficher le type de remède
function getTypeRemede(type: string | number | undefined): string {
  if (!type) return 'Non spécifié'
  switch (type) {
    case 'melange':
    case 1:
      return 'Mélange'
    case 'huile':
    case 2:
      return 'Huile essentielle'
    case 'infusion':
    case 3:
      return 'Infusion'
    default:
      return String(type)
  }
}

// Props
const props = defineProps<{
  remedeId: number
}>()

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
  button {
    min-height: 44px; /* Taille minimum recommandée pour le touch */
  }
  
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