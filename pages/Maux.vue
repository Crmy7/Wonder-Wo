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
          
          <!-- Affichage du profil actif -->
          <div v-if="currentProfil" class="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            <div class="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold">{{ currentProfil.nom.charAt(0) }}</span>
            </div>
            <span>Recherche pour {{ currentProfil.nom }}</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Ex: mal de tête, stress, insomnie..."
              class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
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

        <!-- Filtres rapides -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            @click="filtreActuel = 'tous'"
            :class="filtreActuel === 'tous' ? 'bg-primary text-blanc' : 'bg-blanc text-grey-black hover:bg-primary/10'"
            class="text-sm px-3 py-1 rounded-full border transition-colors"
          >
            Tous ({{ totalRemedes }})
          </button>
          <button
            v-if="remedesAvecPlacardCount > 0"
            @click="filtreActuel = 'placard'"
            :class="filtreActuel === 'placard' ? 'bg-primary text-blanc' : 'bg-blanc text-grey-black hover:bg-primary/10'"
            class="text-sm px-3 py-1 rounded-full border transition-colors"
          >
            🏺 Avec vos produits ({{ remedesAvecPlacardCount }})
          </button>
          <button
            v-if="placardInfo.recettesSansPlacard > 0"
            @click="filtreActuel = 'sans_placard'"
            :class="filtreActuel === 'sans_placard' ? 'bg-primary text-blanc' : 'bg-blanc text-grey-black hover:bg-primary/10'"
            class="text-sm px-3 py-1 rounded-full border transition-colors"
          >
            📦 Autres produits ({{ placardInfo.recettesSansPlacard }})
          </button>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div v-if="searched && hasResults" class="space-y-6">
        <!-- Liste des remèdes filtrés -->
        <div class="grid gap-6">
          <div 
            v-for="recette in remedesFiltres" 
            :key="recette.id" 
            class="bg-blanc p-6 rounded-2xl border transition-all group shadow-sm relative"
            :class="{
              'border-primary/40 bg-primary/5': recette.produitsPlacardDisponibles > 0,
              'border-beige hover:border-primary/20': recette.produitsPlacardDisponibles === 0
            }"
          >
            <!-- Badge prioritaire si produits placard -->
            <div v-if="recette.produitsPlacardDisponibles > 0" class="absolute -top-2 -right-2">
              <div class="bg-primary text-blanc text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span>🏺</span>
                <span>Avec vos produits</span>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <!-- Icône du remède -->
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">{{ recette.imageUrl }}</span>
              </div>
              
              <!-- Contenu -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h4 class="text-lg font-semibold text-grey-black mb-1">{{ recette.nomRecette }}</h4>
                    <p class="text-sm text-grey-black/60">{{ recette.typeApplication }} • {{ recette.categorie }}</p>
                  </div>
                  
                  <!-- Score d'efficacité -->
                  <div class="flex items-center gap-2">
                    <div class="flex items-center" :title="`Efficacité: ${Math.round(recette.efficacite * 100)}%`">
                      <span v-for="i in 5" :key="i" class="text-xs">
                        {{ i <= Math.round(recette.efficacite * 5) ? '⭐' : '☆' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p class="text-grey-black/80 mb-4 leading-relaxed">{{ recette.description }}</p>
                
                <!-- Produits nécessaires -->
                <div class="mb-4">
                  <h5 class="text-sm font-semibold mb-2">
                    Produits nécessaires ({{ recette.produits.length }}) :
                  </h5>
                  <div class="flex flex-wrap gap-2">
                    <div 
                      v-for="produit in recette.produits" 
                      :key="produit.id"
                      class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                      :class="{
                        'bg-primary/20 text-primary border border-primary/30': produit.dansPlacard,
                        'bg-beige text-grey-black border border-beige hover:border-primary/20': !produit.dansPlacard
                      }"
                    >
                      <span class="text-lg">{{ produit.imageUrl }}</span>
                      <div>
                        <span class="font-medium">{{ produit.nom }}</span>
                        <div class="text-xs opacity-80">{{ produit.nomScientifique }}</div>
                        <div class="flex items-center gap-1 mt-1">
                          <span v-if="produit.dansPlacard" class="text-xs font-medium">✓ Dans votre placard</span>
                          <span v-else class="text-xs opacity-60">À acquérir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Adaptation au profil -->
                <div v-if="!recette.adapteAuProfil" class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div class="flex items-center gap-2 text-orange-700">
                    <span>⚠️</span>
                    <span class="text-sm font-medium">Attention : {{ recette.raisonNonAdapte }}</span>
                  </div>
                </div>

                <!-- Tags/catégories -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-if="recette.produitsPlacardDisponibles > 0" class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    🏺 {{ recette.produitsPlacardDisponibles }} produit(s) disponible(s)
                  </span>
                  <span v-if="recette.adapteAuProfil" class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    ✅ Adapté à {{ currentProfil?.nom || 'votre profil' }}
                  </span>
                  <span class="bg-beige text-grey-black text-sm font-medium px-3 py-1 rounded-full">
                    {{ recette.categorie }}
                  </span>
                </div>
                
                <!-- Actions -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="voirDetails(recette)"
                    class="text-primary hover:bg-primary/10 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    📋 Voir détails
                  </button>
                  
                  <button 
                    v-if="recette.produitsPlacardDisponibles === 0"
                    @click="ajouterProduitsAuPlacard(recette)"
                    :disabled="loadingPlacard"
                    class="text-grey-black/60 hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span v-if="loadingPlacard">Ajout...</span>
                    <span v-else>🏺 Ajouter au placard</span>
                  </button>
                  
                  <button 
                    @click="marquerCommeFavori(recette)"
                    class="text-grey-black/60 hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    ⭐ Favori
                  </button>
                  
                  <button 
                    @click="partagerRecette(recette)"
                    class="text-grey-black/60 hover:text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    📤 Partager
                  </button>
                </div>

                <!-- Source -->
                <div class="mt-3 pt-3 border-t border-beige">
                  <p class="text-xs text-grey-black/60">
                    Source : {{ recette.sourceDocumentaire }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
        <h3 class="text-lg font-semibold mb-4">Recherches populaires</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button 
            v-for="suggestion in symptomesPopulaires" 
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
  placardInfo,
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
  symptomesPopulaires
} = useMaux()

// État local
const searchTerm = ref('')
const filtreActuel = ref('tous')
const loadingPlacard = ref(false)

// Auto-remplir depuis query params
onMounted(() => {
  const route = useRoute()
  if (route.query.q) {
    searchTerm.value = route.query.q as string
    handleSearch()
  }
})

// Résultats filtrés selon le filtre actuel
const remedesFiltres = computed(() => {
  switch (filtreActuel.value) {
    case 'placard':
      return getRemediesAvecPlacard.value
    case 'sans_placard':
      return getRemediesSansPlacard.value
    default:
      return getRemediesTries.value
  }
})

// Méthodes
const handleSearch = async () => {
  if (!searchTerm.value.trim()) return
  
  console.log('🔍 [PAGE] Début recherche depuis la page Maux:', searchTerm.value)
  console.log('👤 [PAGE] Profil actuel:', currentProfil.value)
  
  try {
    console.log('📡 [PAGE] Appel rechercherAvecProfilActuel')
    await rechercherAvecProfilActuel(searchTerm.value)
    filtreActuel.value = 'tous' // Reset du filtre
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
  filtreActuel.value = 'tous'
  resetRecherche()
}

const ajouterProduitsAuPlacard = async (recette: ResultatRecherche) => {
  loadingPlacard.value = true
  try {
    await ajouterTousProduitsAuPlacard(recette)
    // Message de succès géré par le composable
  } catch (error: any) {
    console.error('Erreur ajout placard:', error)
    alert('Erreur lors de l\'ajout au placard')
  } finally {
    loadingPlacard.value = false
  }
}

const voirDetails = (recette: ResultatRecherche) => {
  // TODO: Ouvrir modal avec détails complets
  console.log('Voir détails:', recette)
}

const marquerCommeFavori = (recette: ResultatRecherche) => {
  // TODO: Implémenter système de favoris
  console.log('Marquer comme favori:', recette)
  // Ici on pourrait ajouter une mutation pour sauvegarder en base
}

const partagerRecette = (recette: ResultatRecherche) => {
  if (navigator.share) {
    navigator.share({
      title: `Remède naturel: ${recette.nomRecette}`,
      text: recette.description,
      url: window.location.href
    }).catch(console.error)
  } else {
    // Fallback: copier dans le presse-papier
    const textToCopy = `${recette.nomRecette}\n\n${recette.description}\n\nVia Wonder Wo`
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Recette copiée dans le presse-papier !')
    }).catch(console.error)
  }
}

const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back()
  }
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