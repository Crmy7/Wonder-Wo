<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Recherche de Remèdes</h2>
        <p class="accent-text text-3xl">Trouvez des solutions naturelles adaptées</p>
      </div>

      <!-- Bouton retour -->
      <div class="mb-8">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="font-medium">Retour</span>
        </button>
      </div>

      <!-- Section de recherche -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold mb-2">Rechercher un remède naturel</h3>
          <p class="text-grey-black/60">Décrivez votre symptôme pour obtenir des recommandations personnalisées</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              @keyup.enter="searchMaux"
              type="text"
              placeholder="Ex: Coup de soleil, mal de tête, stress..."
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button 
            @click="searchMaux"
            :disabled="loading || !searchTerm.trim()"
            class="secondary-btn px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <!-- Résultats de recherche -->
      <div v-if="searched && results.length > 0" class="space-y-6">
        <div class="bg-beige/30 backdrop-blur-sm p-6 rounded-2xl border border-beige">
          <h3 class="text-xl font-semibold mb-2">Résultats pour "{{ searchTerm }}"</h3>
          <p class="accent-text text-lg">{{ results.length }} remède(s) trouvé(s)</p>
        </div>

        <!-- Liste des remèdes -->
        <div class="grid gap-6">
          <div 
            v-for="recette in results" 
            :key="recette.id" 
            class="bg-blanc p-6 rounded-2xl border border-beige hover:border-primary/20 transition-all group shadow-sm"
          >
            <div class="flex items-start gap-4">
              <!-- Icône du remède -->
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">🌿</span>
              </div>
              
              <!-- Contenu -->
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-grey-black mb-2">{{ recette.nomProduit }}</h4>
                <p class="text-grey-black/70 mb-4 leading-relaxed">{{ recette.description }}</p>
                
                <!-- Tags/catégories -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Naturel
                  </span>
                  <span class="bg-beige text-grey-black text-sm font-medium px-3 py-1 rounded-full">
                    {{ recette.categorie || 'Remède traditionnel' }}
                  </span>
                </div>
                
                <!-- Actions -->
                <div class="flex gap-3">
                  <button class="text-primary hover:bg-primary/10 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Voir détails
                  </button>
                  <button class="text-grey-black/60 hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Ajouter au placard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="searched && results.length === 0" class="bg-blanc p-8 rounded-2xl border border-beige text-center">
        <div class="w-20 h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">🔍</span>
        </div>
        <h3 class="text-lg font-semibold mb-3">Aucun remède trouvé</h3>
        <p class="accent-text mb-6">Aucune recette trouvée pour "{{ searchTerm }}". Essayez avec d'autres mots-clés.</p>
        <button 
          @click="resetSearch"
          class="secondary-btn"
        >
          Nouvelle recherche
        </button>
      </div>

      <!-- Suggestions populaires -->
      <div v-if="!searched" class="bg-blanc p-6 rounded-2xl border border-beige">
        <h3 class="text-lg font-semibold mb-4">Recherches populaires</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button 
            v-for="suggestion in popularSearches" 
            :key="suggestion"
            @click="searchSuggestion(suggestion)"
            class="text-left p-3 bg-beige/30 hover:bg-primary/10 rounded-xl transition-colors group"
          >
            <span class="text-sm font-medium text-grey-black group-hover:text-primary">{{ suggestion }}</span>
          </button>
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
            <span class="text-lg">🌿</span>
            <span class="text-sm font-medium">Explorez les alternatives naturelles</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">👨‍⚕️</span>
            <span class="text-sm font-medium">Consultez un professionnel si nécessaire</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📝</span>
            <span class="text-sm font-medium">Notez les remèdes efficaces</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Types
interface Recette {
  id: number
  nomProduit: string
  description: string
  categorie?: string
}

// État réactif
const searchTerm = ref('')
const results = ref<Recette[]>([])
const searched = ref(false)
const loading = ref(false)
const error = ref('')

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

// Méthodes
const searchMaux = async () => {
  if (!searchTerm.value.trim()) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Remplacer par un vrai appel API
    // const response = await fetch(`/api/maux?symptome=${encodeURIComponent(searchTerm.value)}`)
    // const data = await response.json()
    // results.value = data
    
    // Données simulées pour la démonstration
    const mockResults: Recette[] = [
      {
        id: 1,
        nomProduit: 'Aloe Vera',
        description: 'Gel d\'aloe vera frais à appliquer directement sur la peau brûlée. Ses propriétés anti-inflammatoires et hydratantes soulagent rapidement les coups de soleil.',
        categorie: 'Soin externe'
      },
      {
        id: 2,
        nomProduit: 'Infusion de Camomille',
        description: 'Préparez une infusion de camomille, laissez refroidir et appliquez avec des compresses. La camomille apaise les inflammations cutanées.',
        categorie: 'Infusion'
      },
      {
        id: 3,
        nomProduit: 'Huile de Coco',
        description: 'L\'huile de coco vierge hydrate en profondeur et aide à la régénération de la peau après un coup de soleil.',
        categorie: 'Huile naturelle'
      }
    ]
    
    // Filtrer selon le terme de recherche (simulation)
    if (searchTerm.value.toLowerCase().includes('soleil') || 
        searchTerm.value.toLowerCase().includes('brûlure')) {
      results.value = mockResults
    } else {
      results.value = [
        {
          id: 4,
          nomProduit: 'Menthe poivrée',
          description: `Remède naturel adapté pour "${searchTerm.value}". Propriétés rafraîchissantes et apaisantes.`,
          categorie: 'Plante médicinale'
        }
      ]
    }
    
    searched.value = true
    
  } catch (err) {
    error.value = 'Erreur lors de la recherche. Veuillez réessayer.'
    console.error('Erreur recherche:', err)
  } finally {
    loading.value = false
  }
}

const searchSuggestion = (suggestion: string) => {
  searchTerm.value = suggestion
  searchMaux()
}

const resetSearch = () => {
  searchTerm.value = ''
  results.value = []
  searched.value = false
  error.value = ''
}

const clearError = () => {
  error.value = ''
}

const goBack = () => {
  // Navigation vers la page précédente
  if (typeof window !== 'undefined') {
    window.history.back()
  }
}
</script>

<style scoped>
/* Utilisation des mêmes variables CSS que la page profil */


/* Variables CSS pour cohérence avec le design */
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