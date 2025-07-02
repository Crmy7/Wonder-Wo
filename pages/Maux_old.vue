<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">Wonder Wo</h1>
        <h2 class="text-lg sm:text-xl font-medium text-grey-black mb-1 sm:mb-2">Recherche de Remèdes</h2>
        <p class="accent-text text-xl sm:text-3xl">Trouvez des solutions naturelles adaptées</p>
      </div>

      <!-- Section de recherche -->
      <div class="bg-primary/5 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-primary/20 mb-6 sm:mb-8">
        <div class="text-center mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-semibold mb-2">Rechercher un remède naturel</h3>
          <p class="text-sm sm:text-base text-grey-black/60 px-2">Décrivez votre symptôme pour obtenir des recommandations personnalisées</p>
        </div>
        
        <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 max-w-2xl mx-auto">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              @keyup.enter="handleSearch"
              @input="handleInputChange"
              type="text"
              placeholder="Ex: Coup de soleil, mal de tête..."
              class="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button 
            @click="handleSearch"
            :disabled="loading || !searchTerm.trim()"
            class="primary-btn px-6 sm:px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span v-if="loading">Recherche...</span>
            <span v-else class="flex items-center gap-2">
              <span>🔍</span>
              <span class="xs:inline">Rechercher</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Messages d'état -->
      <div v-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <div class="flex justify-between items-start gap-3">
          <p class="text-secondary text-sm font-medium flex-1">{{ error }}</p>
          <button @click="clearError" class="text-secondary hover:text-secondary/80 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page de détail -->
      <DetailRemede 
        v-if="showDetail && selectedRemedyId" 
        :remede-id="selectedRemedyId"
        @go-back="closeDetail"
      />

      <!-- État de chargement -->
      <div v-else-if="loading" class="bg-blanc p-6 sm:p-8 rounded-2xl border border-beige text-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Recherche en cours...</h3>
        <p class="accent-text text-sm sm:text-base px-4">Nous recherchons les meilleures recettes pour "{{ searchTerm }}"</p>
      </div>

      <!-- Résultats de recherche -->
      <div v-else-if="hasSearched && hasSearchTerm && results.length > 0" class="space-y-4 sm:space-y-6">
        <div class="bg-beige/30 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-beige">
          <h3 class="text-lg sm:text-xl font-semibold mb-2">Résultats pour "{{ searchTerm }}"</h3>
          <p class="accent-text text-base sm:text-lg">{{ results.length }} recette(s) trouvée(s)</p>
        </div>

        <!-- Liste des recettes -->
        <div class="grid gap-4 sm:gap-6">
          <div 
            v-for="recette in results" 
            :key="recette.id" 
            class="bg-blanc p-4 sm:p-6 rounded-2xl border border-beige hover:border-primary/20 transition-all group shadow-sm"
          >
            <!-- Layout mobile vs desktop -->
            <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <!-- Image du produit associé -->
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
                <img 
                  v-if="recette.produit?.Image_url" 
                  :src="recette.produit.Image_url" 
                  :alt="recette.produit.Nom_Commun"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <span v-else class="text-xl sm:text-2xl">🌿</span>
              </div>
              
              <!-- Contenu de la recette -->
              <div class="flex-1 text-center sm:text-left">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                  <div class="flex-1">
                    <h4 class="text-base sm:text-lg font-semibold text-grey-black mb-1">
                      Remède à base de {{ recette.produit?.Nom_Commun || 'plante naturelle' }}
                    </h4>
                    <p class="text-xs sm:text-sm text-grey-black/60 italic mb-1">
                      {{ recette.produit?.Nom_Scientifique }}
                    </p>
                    <p class="text-xs sm:text-sm text-grey-black/70">
                      Pour traiter : {{ recette.maux?.Symptom }}
                    </p>
                  </div>
                  <div class="flex items-center justify-center sm:justify-start gap-2">
                    <span class="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      Efficacité: {{ recette.Efficacite || 'N/A' }}/5
                    </span>
                  </div>
                </div>
                
                <!-- Aperçu de la recette -->
                <div class="bg-beige/20 p-3 rounded-xl mb-3 sm:mb-4">
                  <p class="text-grey-black/80 text-xs sm:text-sm leading-relaxed">
                    {{ truncateText(recette.Recette, isMobile ? 100 : 150) }}
                  </p>
                </div>
                
                <!-- Informations rapides -->
                <div class="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
                  <span class="bg-beige text-grey-black text-xs font-medium px-2 py-1 rounded-full">
                    {{ truncateText(recette.produit?.Famille_Botanique, 15) }}
                  </span>
                  <span class="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {{ getTypeRemede(recette.Type_Remede) }}
                  </span>
                  <span class="bg-beige text-grey-black text-xs font-medium px-2 py-1 rounded-full">
                    {{ getTypeApplication(recette.Type_Application) }}
                  </span>
                  <span class="bg-beige text-grey-black text-xs font-medium px-2 py-1 rounded-full">
                    {{ getTrancheAge(recette.Tranche_age) }}
                  </span>
                  <span v-if="recette.Femme_Enceinte" class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Femmes enceintes
                  </span>
                </div>
                
                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button 
                    @click="viewDetail(recette.id)"
                    class="text-primary hover:bg-primary/10 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none"
                  >
                    Voir la recette complète
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="hasSearched && hasSearchTerm && results.length === 0 && !loading" class="bg-blanc p-6 sm:p-8 rounded-2xl border border-beige text-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <span class="text-2xl sm:text-3xl">🔍</span>
        </div>
        <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Aucune recette trouvée</h3>
        <p class="accent-text mb-4 sm:mb-6 text-sm sm:text-base px-4">Aucune recette trouvée pour "{{ searchTerm }}". Essayez avec d'autres mots-clés.</p>
        <button 
          @click="resetSearch"
          class="secondary-btn text-sm sm:text-base"
        >
          Nouvelle recherche
        </button>
      </div>

      <!-- Suggestions populaires (affichées par défaut ou quand le champ est vide) -->
      <div v-if="!hasSearchTerm && !showDetail" class="bg-blanc p-4 sm:p-6 rounded-2xl border border-beige">
        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recherches populaires</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          <button 
            v-for="suggestion in popularSearches" 
            :key="suggestion"
            @click="searchSuggestion(suggestion)"
            class="text-left p-3 bg-beige/30 hover:bg-primary/10 rounded-xl transition-colors group"
          >
            <span class="text-xs sm:text-sm font-medium text-grey-black group-hover:text-primary">{{ suggestion }}</span>
          </button>
        </div>
      </div>

      <!-- Conseils -->
      <div v-if="!showDetail" class="bg-primary/5 p-4 sm:p-6 rounded-2xl border border-primary/10 mt-6 sm:mt-8">
        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>Conseils de recherche</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-base sm:text-lg flex-shrink-0">🎯</span>
            <span class="text-xs sm:text-sm font-medium">Soyez précis dans vos symptômes</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-base sm:text-lg flex-shrink-0">🌿</span>
            <span class="text-xs sm:text-sm font-medium">Explorez les alternatives naturelles</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-base sm:text-lg flex-shrink-0">👨‍⚕️</span>
            <span class="text-xs sm:text-sm font-medium">Consultez un professionnel si nécessaire</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-base sm:text-lg flex-shrink-0">📝</span>
            <span class="text-xs sm:text-sm font-medium">Notez les recettes efficaces</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DetailRemede from './recettes/[id].vue'

// Types basés sur vos modèles
interface Produit {
  id: number
  Image_url: string
  Nom_Commun: string
  Nom_Scientifique: string
  Famille_Botanique: string
  Partie_Plante: string
  Composition: string
  Forme_Galenique: number
  Propriete_Principale: string
  Propriete_Secondaire: string
  Utilisation: string
  Precautions: string
  Source: string
}

interface Recette {
  id: number
  Type_Remede: number
  Type_Application: number
  Recette: string
  Tranche_age: number
  Femme_Enceinte: boolean
  Source_Documentaire: string
  Efficacite: number
  IdProduit: number
  IdMaux: number
  produit?: Produit
  maux?: Maux
}

interface Maux {
  id: number
  Symptom: string
  IdProduit: number
}

// Émissions
const emit = defineEmits<{
  goBack: []
}>()

// État réactif
const searchTerm = ref('')
const results = ref<Recette[]>([])
const hasSearched = ref(false)
const loading = ref(false)
const error = ref('')
const showDetail = ref(false)
const selectedRemedyId = ref<number | null>(null)
const windowWidth = ref(0)

// Computed properties
const isMobile = computed(() => windowWidth.value < 640)
const hasSearchTerm = computed(() => searchTerm.value.trim().length > 0)

// Gestion du resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', updateWindowWidth)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

// Suggestions populaires
const popularSearches = [
  'Coup de soleil',
  'Mal de tête',
  'Stress',
  'Insomnie',
  'Rhume',
  'Digestion difficile',
  'Fatigue',
  'Anxiété',
  'Mal de gorge'
]

// Méthodes utilitaires
const getTypeRemede = (type: number | undefined): string => {
  const types = {
    1: 'Traditionnel',
    2: 'Aromathérapie',
    3: 'Phytothérapie',
    4: 'Homéopathie',
    5: 'Externe'
  }
  return types[type as keyof typeof types] || 'Non spécifié'
}

const getTypeApplication = (type: number | undefined): string => {
  const types = {
    1: 'Externe',
    2: 'Orale',
    3: 'Inhalation',
    4: 'Bain',
    5: 'Gargarisme',
    6: 'Compresse'
  }
  return types[type as keyof typeof types] || 'Non spécifié'
}

const getTrancheAge = (age: number | undefined): string => {
  const tranches = {
    1: 'Tous âges',
    2: 'Adultes',
    3: '+12 ans',
    4: '+6 ans',
    5: '+18 ans'
  }
  return tranches[age as keyof typeof tranches] || 'Non spécifié'
}

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return 'Recette non disponible'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // Remplacer par l'icône par défaut
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = '<span class="text-xl sm:text-2xl">🌿</span>'
  }
}

// Méthodes de gestion de la recherche
const handleInputChange = () => {
  // Si le champ devient vide, réinitialiser l'état de recherche
  if (!searchTerm.value.trim()) {
    hasSearched.value = false
    results.value = []
    error.value = ''
  }
}

const handleSearch = async () => {
  if (!searchTerm.value.trim()) return
  
  loading.value = true
  error.value = ''
  hasSearched.value = true
  
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Remplacer par un vrai appel API
    // const response = await fetch(`/api/recettes?symptome=${encodeURIComponent(searchTerm.value)}`)
    // const data = await response.json()
    // results.value = data
    
    // Données simulées basées sur vos modèles - Focus sur les recettes
    const mockRecettes: Recette[] = [
      {
        id: 1,
        Type_Remede: 3, // Phytothérapie
        Type_Application: 1, // Application externe
        Recette: 'Couper une feuille d\'aloe vera fraîche. Extraire le gel transparent en évitant la partie jaune. Appliquer directement sur la peau brûlée. Laisser sécher naturellement. Répéter 3-4 fois par jour jusqu\'à guérison complète.',
        Tranche_age: 1, // Tous âges
        Femme_Enceinte: true,
        Source_Documentaire: 'Journal of Dermatological Treatment, 2019',
        Efficacite: 4,
        IdProduit: 1,
        IdMaux: 1,
        produit: {
          id: 1,
          Image_url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
          Nom_Commun: 'Aloe Vera',
          Nom_Scientifique: 'Aloe barbadensis Miller',
          Famille_Botanique: 'Asphodelaceae',
          Partie_Plante: 'Feuilles (gel)',
          Composition: 'Polysaccharides, vitamines A, C, E, acides aminés',
          Forme_Galenique: 6,
          Propriete_Principale: 'Anti-inflammatoire et cicatrisant',
          Propriete_Secondaire: 'Hydratant, apaisant, antimicrobien',
          Utilisation: 'Application directe sur la peau',
          Precautions: 'Éviter le contact avec les yeux',
          Source: 'Pharmacopée européenne'
        },
        maux: {
          id: 1,
          Symptom: 'Coup de soleil',
          IdProduit: 1
        }
      },
      {
        id: 2,
        Type_Remede: 3, // Phytothérapie
        Type_Application: 6, // Compresse
        Recette: 'Préparer une infusion de camomille avec 2 cuillères à soupe de fleurs séchées dans 250ml d\'eau bouillante. Laisser infuser 10 minutes puis filtrer. Laisser refroidir complètement. Imbiber une compresse propre et appliquer sur la zone brûlée pendant 15-20 minutes, 3 fois par jour.',
        Tranche_age: 1, // Tous âges
        Femme_Enceinte: true,
        Source_Documentaire: 'Phytotherapy Research, 2018',
        Efficacite: 3,
        IdProduit: 2,
        IdMaux: 1,
        produit: {
          id: 2,
          Image_url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
          Nom_Commun: 'Camomille',
          Nom_Scientifique: 'Matricaria chamomilla',
          Famille_Botanique: 'Asteraceae',
          Partie_Plante: 'Fleurs',
          Composition: 'Chamazulène, bisabolol, flavonoïdes',
          Forme_Galenique: 1,
          Propriete_Principale: 'Anti-inflammatoire',
          Propriete_Secondaire: 'Apaisant, antispasmodique',
          Utilisation: 'Infusion pour compresses',
          Precautions: 'Allergie possible aux Asteraceae',
          Source: 'Pharmacopée française'
        },
        maux: {
          id: 1,
          Symptom: 'Coup de soleil',
          IdProduit: 2
        }
      },
      {
        id: 3,
        Type_Remede: 3, // Phytothérapie
        Type_Application: 1, // Application externe
        Recette: 'Mélanger 2 cuillères à soupe de gel d\'aloe vera avec 1 cuillère à café d\'huile de coco vierge. Ajouter 2 gouttes d\'huile essentielle de lavande. Bien mélanger et appliquer délicatement sur la peau brûlée. Laisser pénétrer sans rincer. Utiliser 2-3 fois par jour.',
        Tranche_age: 3, // Enfants de plus de 12 ans
        Femme_Enceinte: false,
        Source_Documentaire: 'International Journal of Aromatherapy, 2020',
        Efficacite: 5,
        IdProduit: 3,
        IdMaux: 1,
        produit: {
          id: 3,
          Image_url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
          Nom_Commun: 'Lavande',
          Nom_Scientifique: 'Lavandula angustifolia',
          Famille_Botanique: 'Lamiaceae',
          Partie_Plante: 'Fleurs',
          Composition: 'Linalol, acétate de linalyle, camphre',
          Forme_Galenique: 4,
          Propriete_Principale: 'Cicatrisant et apaisant',
          Propriete_Secondaire: 'Anti-inflammatoire, antiseptique',
          Utilisation: 'Huile essentielle diluée',
          Precautions: 'Ne pas utiliser pure, diluer obligatoirement',
          Source: 'Pharmacopée européenne'
        },
        maux: {
          id: 1,
          Symptom: 'Coup de soleil',
          IdProduit: 3
        }
      }
    ]
    
    // Filtrer selon le terme de recherche
    if (searchTerm.value.toLowerCase().includes('soleil') || 
        searchTerm.value.toLowerCase().includes('brûlure')) {
      results.value = mockRecettes
    } else if (searchTerm.value.toLowerCase().includes('stress') ||
               searchTerm.value.toLowerCase().includes('anxiété')) {
      results.value = [mockRecettes[2]] // Lavande pour le stress
    } else {
      results.value = [mockRecettes[0]] // Retourner au moins une recette pour la démo
    }
    
  } catch (err) {
    error.value = 'Erreur lors de la recherche. Veuillez réessayer.'
    console.error('Erreur recherche:', err)
  } finally {
    loading.value = false
  }
}

const searchSuggestion = (suggestion: string) => {
  searchTerm.value = suggestion
  handleSearch()
}

const resetSearch = () => {
  searchTerm.value = ''
  results.value = []
  hasSearched.value = false
  error.value = ''
  showDetail.value = false
  selectedRemedyId.value = null
}

const clearError = () => {
  error.value = ''
}

const viewDetail = (recetteId: number) => {
  selectedRemedyId.value = recetteId
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selectedRemedyId.value = null
}

const goBack = () => {
  emit('goBack')
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

/* Animation de rotation pour le spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Breakpoint personnalisé pour très petits écrans */
@media (min-width: 475px) {
  .xs\:inline {
    display: inline;
  }
}

/* Améliorations pour le touch sur mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px; /* Taille minimum recommandée pour le touch */
  }
  
  input {
    min-height: 44px;
  }
}
</style>