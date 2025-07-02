<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Profils Familiaux</h2>
        <p class="accent-text text-3xl">Créez des profils personnalisés pour chaque membre</p>
      </div>

      <!-- Switch de profil actif -->
      <div v-if="hasProfiles" class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8 z-10 relative">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-lg font-bold text-primary">{{ currentProfil?.nom?.charAt(0) || 'P' }}</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Profil actif : {{ currentProfil?.nom || 'Aucun' }}</h3>
              <p class="text-sm text-grey-black/60">
                {{ currentProfil?.age }} ans
                <template v-if="currentProfil?.grossesse"> • Enceinte</template>
                <template v-if="currentProfil?.enfants"> • Parent</template>
              </p>
            </div>
          </div>
          
          <!-- Dropdown switch profil -->
          <div class="relative">
                          <button
                @click="showProfilSwitch = !showProfilSwitch"
                class="flex items-center space-x-2 px-4 py-2 bg-primary text-blanc rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
              <span class="font-medium">Changer de profil</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showProfilSwitch }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="showProfilSwitch" class="absolute top-full right-0 mt-2 w-72 bg-[var(--color-blanc)] rounded-xl shadow-lg border border-beige overflow-hidden animate-slideDown z-[999]">
              <div class="p-3 border-b border-beige">
                <p class="text-sm font-medium text-grey-black">Sélectionner un profil</p>
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="profil in profils"
                  :key="profil.id"
                  @click="selectProfil(profil)"
                  class="flex items-center space-x-3 px-3 py-3 hover:bg-beige cursor-pointer transition-colors"
                  :class="{ 'bg-beige': currentProfil?.id === profil.id }"
                >
                  <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-primary">{{ profil.nom.charAt(0) }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-grey-black">{{ profil.nom }}</p>
                    <div class="flex items-center space-x-2 text-xs text-grey-black/60">
                      <span>{{ profil.age }} ans</span>
                      <span v-if="profil.grossesse" class="bg-primary/10 text-primary px-2 py-0.5 rounded-full">🤱 Enceinte</span>
                      <span v-if="profil.enfants" class="bg-primary/10 text-primary px-2 py-0.5 rounded-full">👨‍👩‍👧‍👦 Parent</span>
                    </div>
                  </div>
                  <div v-if="currentProfil?.id === profil.id" class="text-primary">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-beige/30 backdrop-blur-sm p-6 rounded-2xl border border-beige mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 class="text-xl font-semibold mb-1">Mes Profils</h3>
            <p class="text-3xl accent-text">{{ profilCount }} profil(s)</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="showCreateForm = !showCreateForm"
              class="primary-btn"
            >
              <span v-if="showCreateForm">Annuler</span>
              <span v-else>+ Ajouter un profil</span>
            </button>
            <button
              @click="handleLogout"
              :disabled="authStore.loading"
              class="secondary-btn"
            >
              <span v-if="authStore.loading">Déconnexion...</span>
              <span v-else>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages d'erreur du store -->
      <div v-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-start">
          <p class="text-secondary text-sm font-medium">{{ error }}</p>
          <button @click="clearError()" class="text-secondary hover:text-secondary/80">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulaire de création -->
      <div v-if="showCreateForm" class="bg-blanc p-6 rounded-2xl border border-beige mb-8 shadow-sm">
        <h3 class="text-lg font-semibold mb-6">Créer un nouveau profil</h3>
        
        <form @submit.prevent="handleCreateProfil" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Nom -->
            <div>
              <label for="nom" class="block text-sm font-medium mb-2">
                Nom / Prénom
              </label>
              <input
                id="nom"
                v-model="newProfil.nom"
                type="text"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="ex: Marie, Papa, Maman..."
              />
            </div>
            
            <!-- Âge -->
            <div>
              <label for="age" class="block text-sm font-medium mb-2">
                Âge
              </label>
              <input
                id="age"
                v-model="newProfil.age"
                type="number"
                min="0"
                max="120"
                required
                class="w-full px-4 py-3 border border-beige rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="ex: 35"
              />
            </div>
          </div>
          
          <!-- Options spéciales -->
          <div class="space-y-4">
            <div class="flex items-center p-3 bg-beige/20 rounded-xl">
              <input
                id="grossesse"
                v-model="newProfil.grossesse"
                type="checkbox"
                class="h-5 w-5 text-primary focus:ring-primary border-beige rounded"
              />
              <label for="grossesse" class="ml-3 text-sm font-medium">
                🤱 Enceinte <span class="text-xs accent-text">(recommandations adaptées)</span>
              </label>
            </div>
            
            <div class="flex items-center p-3 bg-beige/20 rounded-xl">
              <input
                id="enfants"
                v-model="newProfil.enfants"
                type="checkbox"
                class="h-5 w-5 text-primary focus:ring-primary border-beige rounded"
              />
              <label for="enfants" class="ml-3 text-sm font-medium">
                👨‍👩‍👧‍👦 Parent <span class="text-xs accent-text">(conseils familiaux)</span>
              </label>
            </div>
          </div>
          
          <!-- Messages -->
          <div v-if="createError" class="p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
            <p class="text-secondary text-sm font-medium">{{ createError }}</p>
          </div>
          
          <div v-if="createSuccess" class="p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p class="text-primary text-sm font-medium">{{ createSuccess }}</p>
          </div>
          
          <!-- Boutons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="primary-btn flex-1"
            >
              <span v-if="loading">Création...</span>
              <span v-else>Créer le profil</span>
            </button>
            
            <button
              type="button"
              @click="resetCreateForm"
              class="secondary-btn"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des profils -->
      <div class="space-y-6">
        <div v-if="!hasProfiles" class="bg-blanc p-8 rounded-2xl border border-beige text-center">
          <div class="w-20 h-20 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">👨‍👩‍👧‍👦</span>
          </div>
          <h3 class="text-lg font-semibold mb-3">Aucun profil créé</h3>
          <p class="accent-text mb-6">Commencez par créer un profil pour recevoir des recommandations personnalisées</p>
          <button
            @click="showCreateForm = true"
            class="primary-btn"
          >
            Créer mon premier profil
          </button>
        </div>

        <!-- Profils existants -->
        <div v-for="profil in profils" :key="profil.id" class="bg-blanc p-6 rounded-2xl border border-beige hover:border-primary/20 transition-all group">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h3 class="text-lg font-semibold">{{ profil.nom }}</h3>
                <span class="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {{ profil.age }} ans
                </span>
                <!-- Indicateur profil actif -->
                <span v-if="currentProfil?.id === profil.id" class="bg-primary text-blanc text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  ACTIF
                </span>
              </div>
              
              <div class="flex flex-wrap gap-2 text-sm">
                <span v-if="profil.grossesse" class="bg-beige text-grey-black px-3 py-1 rounded-full flex items-center gap-1">
                  🤱 <span class="font-hashtag text-xl">Enceinte</span>
                </span>
                <span v-if="profil.enfants" class="bg-beige text-grey-black px-3 py-1 rounded-full flex items-center gap-1">
                  👨‍👩‍👧‍👦 <span class="font-hashtag text-xl">Parent</span>
                </span>
                <span v-if="!profil.grossesse && !profil.enfants" class="accent-text-primary text-xl">
                  Profil standard
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Bouton Activer si pas déjà actif -->
              <button
                v-if="currentProfil?.id !== profil.id"
                @click="selectProfil(profil)"
                class="text-primary hover:bg-primary/10 text-sm font-medium px-3 py-1 rounded-lg transition-colors"
              >
                Activer
              </button>
              
              <button
                @click="handleDeleteProfil(profil.id)"
                :disabled="loading"
                class="text-secondary hover:text-primary text-sm font-medium transition-colors opacity-60 group-hover:opacity-100"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion des maux courants -->
      <div class="bg-blanc p-6 rounded-2xl border border-beige mt-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <span>🎯</span>
              <span>Mes maux courants</span>
            </h3>
            <p class="text-sm text-grey-black/60 mt-1">
              Définissez vos maux récurrents pour des suggestions personnalisées
            </p>
          </div>
          <button
            @click="showMauxForm = !showMauxForm"
            class="primary-btn text-sm"
          >
            <span v-if="showMauxForm">Annuler</span>
            <span v-else>{{ userMauxCourants.length > 0 ? 'Modifier' : 'Définir' }}</span>
          </button>
        </div>

        <!-- Maux actuels -->
        <div v-if="userMauxCourants.length > 0 && !showMauxForm" class="mb-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="mal in userMauxCourants"
              :key="mal.id"
              class="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10"
            >
              <span class="text-lg">{{ mal.icon || '🌿' }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">{{ mal.symptom }}</p>
                <p class="text-xs text-grey-black/60">Priorité {{ mal.priorite }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun mal défini -->
        <div v-if="userMauxCourants.length === 0 && !showMauxForm" class="text-center py-8">
          <div class="w-16 h-16 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎯</span>
          </div>
          <p class="text-grey-black/60 mb-4">Aucun mal courant défini</p>
          <button
            @click="showMauxForm = true"
            class="primary-btn"
          >
            Définir mes maux courants
          </button>
        </div>

        <!-- Formulaire de sélection des maux -->
        <div v-if="showMauxForm" class="space-y-6">
          <!-- Chargement -->
          <div v-if="mauxLoading" class="text-center py-8">
            <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-sm text-grey-black/60">Chargement des maux disponibles...</p>
          </div>

          <!-- Liste de sélection -->
          <div v-else>
            <div class="mb-4">
              <p class="text-sm font-medium text-grey-black mb-2">
                Sélectionnez vos maux courants ({{ selectedMauxIds.length }} sélectionné(s))
              </p>
              <p class="text-xs text-grey-black/60">
                Les maux que vous rencontrez régulièrement apparaîtront sur votre page d'accueil
              </p>
            </div>

            <div class="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto border border-beige rounded-xl p-4">
              <label
                v-for="mal in availableMaux"
                :key="mal.id"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-beige/30 cursor-pointer transition-colors"
                :class="{ 'bg-primary/5 border border-primary/20': selectedMauxIds.includes(mal.id) }"
              >
                <input
                  v-model="selectedMauxIds"
                  type="checkbox"
                  :value="mal.id"
                  class="h-4 w-4 text-primary focus:ring-primary border-beige rounded"
                />
                <span class="text-xl">{{ mal.icon }}</span>
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ mal.symptom }}</p>
                  <p class="text-xs text-grey-black/60">{{ mal.category }}</p>
                </div>
              </label>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <button
                @click="saveMauxCourants"
                :disabled="mauxSaving"
                class="primary-btn flex-1"
              >
                <span v-if="mauxSaving">Sauvegarde...</span>
                <span v-else>Sauvegarder ({{ selectedMauxIds.length }})</span>
              </button>
              <button
                @click="cancelMauxForm"
                class="secondary-btn"
              >
                Annuler
              </button>
            </div>

            <!-- Messages -->
            <div v-if="mauxError" class="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
              <p class="text-secondary text-sm font-medium">{{ mauxError }}</p>
            </div>
            
            <div v-if="mauxSuccess" class="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p class="text-primary text-sm font-medium">{{ mauxSuccess }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes -->
      <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10 mt-8">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🚀</span>
          <span>Prochaines étapes</span>
        </h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">✨</span>
            <span class="text-sm font-medium">Remèdes personnalisés</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">🌿</span>
            <span class="text-sm font-medium">IA adaptée à l'âge</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📦</span>
            <span class="text-sm font-medium">Placard virtuel</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-blanc/50 rounded-xl">
            <span class="text-lg">📚</span>
            <span class="text-sm font-medium">Bibliothèque naturelle</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateProfilData } from '~/types/profil'

// Configuration de la page
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Composables
const authStore = useAuthStore()
const { 
  profils, 
  currentProfil, 
  hasProfiles, 
  profilCount,
  error,
  loading,
  selectProfil: selectProfilStore,
  createProfil: createProfilStore,
  deleteProfil: deleteProfilStore,
  clearError,
  initProfils,
  resetStore 
} = useProfils()

// Composable pour la gestion du formulaire de création
const useCreateProfilForm = () => {
  const showCreateForm = ref(false)
  const createError = ref('')
  const createSuccess = ref('')

  const newProfil = reactive<CreateProfilData>({
    nom: '',
    age: 0,
    grossesse: false,
    enfants: false
  })

  const resetForm = () => {
    newProfil.nom = ''
    newProfil.age = 0
    newProfil.grossesse = false
    newProfil.enfants = false
    createError.value = ''
    createSuccess.value = ''
  }

  const submitForm = async () => {
    createError.value = ''
    createSuccess.value = ''
    
    try {
      const result = await createProfilStore({
        nom: newProfil.nom,
        age: Number(newProfil.age),
        grossesse: newProfil.grossesse,
        enfants: newProfil.enfants
      })
      
      createSuccess.value = result.message || 'Profil créé avec succès !'
      resetForm()
      
      // Masquer le formulaire après 2 secondes
      setTimeout(() => {
        showCreateForm.value = false
      }, 2000)
      
    } catch (error: any) {
      console.error('Erreur création profil:', error)
      createError.value = error.statusMessage || 'Erreur lors de la création du profil'
    }
  }

  return {
    showCreateForm,
    createError,
    createSuccess,
    newProfil,
    resetForm,
    submitForm
  }
}

// Composable pour la gestion du switch de profil
const useProfilSwitch = () => {
  const showProfilSwitch = ref(false)

  const selectProfil = async (profil: any) => {
    try {
      await selectProfilStore(profil)
      showProfilSwitch.value = false
    } catch (error) {
      console.error('Erreur sélection profil:', error)
    }
  }

  // Fermer le dropdown au clic extérieur
  onMounted(() => {
    if (process.client) {
      const closeDropdown = (event: Event) => {
        if (!(event.target as Element).closest('.relative')) {
          showProfilSwitch.value = false
        }
      }
      document.addEventListener('click', closeDropdown)
      
      onUnmounted(() => {
        document.removeEventListener('click', closeDropdown)
      })
    }
  })

  return {
    showProfilSwitch,
    selectProfil
  }
}

// Composable pour la gestion des actions sur les profils
const useProfilActions = () => {
  const deleteProfil = async (profilId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      return
    }
    
    try {
      await deleteProfilStore(profilId)
    } catch (error: any) {
      console.error('Erreur suppression profil:', error)
      alert('Erreur lors de la suppression du profil')
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      resetStore()
      await navigateTo('/')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  return {
    deleteProfil,
    logout
  }
}

// Composable pour la gestion des maux courants
const useMauxCourants = () => {
  const showMauxForm = ref(false)
  const userMauxCourants = ref<any[]>([])
  const availableMaux = ref<any[]>([])
  const selectedMauxIds = ref<number[]>([])
  const mauxLoading = ref(false)
  const mauxSaving = ref(false)
  const mauxError = ref('')
  const mauxSuccess = ref('')

  // Charger les maux courants de l'utilisateur
  const loadUserMauxCourants = async () => {
    try {
      const response = await $fetch('/api/user/maux-courants')
      userMauxCourants.value = response.mauxCourants.map((mal: any) => ({
        ...mal,
        icon: getIconForSymptom(mal.symptom),
        category: getCategoryForSymptom(mal.symptom)
      }))
    } catch (error) {
      console.error('Erreur chargement maux courants:', error)
      userMauxCourants.value = []
    }
  }

  // Charger les maux disponibles pour sélection
  const loadAvailableMaux = async () => {
    mauxLoading.value = true
    try {
      const response = await $fetch('/api/maux/selection')
      availableMaux.value = response.maux || []
    } catch (error) {
      console.error('Erreur chargement maux disponibles:', error)
      availableMaux.value = []
    } finally {
      mauxLoading.value = false
    }
  }

  // Fonctions utilitaires pour les icônes et catégories
  const getIconForSymptom = (symptom: string): string => {
    const symptomLower = symptom.toLowerCase()
    
    if (symptomLower.includes('stress')) return '😰'
    if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return '😴'
    if (symptomLower.includes('anxiété') || symptomLower.includes('angoisse')) return '😟'
    if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement')) return '😪'
    if (symptomLower.includes('mal de tête') || symptomLower.includes('migraine')) return '🤕'
    if (symptomLower.includes('digestion') || symptomLower.includes('crampes') || symptomLower.includes('ballonnements')) return '🤢'
    if (symptomLower.includes('rhume') || symptomLower.includes('toux') || symptomLower.includes('grippe')) return '🤧'
    if (symptomLower.includes('douleur') || symptomLower.includes('mal')) return '💊'
    if (symptomLower.includes('nausées') || symptomLower.includes('vomissement')) return '🤮'
    if (symptomLower.includes('fièvre')) return '🤒'
    
    return '🌿'
  }

  const getCategoryForSymptom = (symptom: string): string => {
    const symptomLower = symptom.toLowerCase()
    
    if (symptomLower.includes('stress') || symptomLower.includes('anxiété')) return 'Mental'
    if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return 'Sommeil'
    if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement')) return 'Énergie'
    if (symptomLower.includes('digestion') || symptomLower.includes('crampes')) return 'Digestif'
    if (symptomLower.includes('rhume') || symptomLower.includes('toux')) return 'Respiratoire'
    if (symptomLower.includes('douleur') || symptomLower.includes('mal de tête')) return 'Douleur'
    
    return 'Général'
  }

  // Sauvegarder les maux sélectionnés
  const saveMauxCourants = async () => {
    mauxSaving.value = true
    mauxError.value = ''
    mauxSuccess.value = ''
    
    try {
      await $fetch('/api/user/maux-courants', {
        method: 'POST',
        body: { 
          mauxIds: selectedMauxIds.value,
          action: 'replace'
        }
      })
      
      mauxSuccess.value = `${selectedMauxIds.value.length} mal(aux) courant(s) sauvegardé(s) !`
      
      // Recharger les maux de l'utilisateur
      await loadUserMauxCourants()
      
      // Fermer le formulaire après 2 secondes
      setTimeout(() => {
        showMauxForm.value = false
        mauxSuccess.value = ''
      }, 2000)
      
    } catch (error: any) {
      console.error('Erreur sauvegarde maux courants:', error)
      mauxError.value = error.data?.message || 'Erreur lors de la sauvegarde'
    } finally {
      mauxSaving.value = false
    }
  }

  // Annuler le formulaire
  const cancelMauxForm = () => {
    showMauxForm.value = false
    selectedMauxIds.value = []
    mauxError.value = ''
    mauxSuccess.value = ''
  }

  // Ouvrir le formulaire avec les maux actuels pré-sélectionnés
  const openMauxForm = async () => {
    showMauxForm.value = true
    selectedMauxIds.value = userMauxCourants.value.map(mal => mal.id)
    await loadAvailableMaux()
  }

  // Watcher pour charger les maux automatiquement quand on ouvre le formulaire
  watch(showMauxForm, async (newValue) => {
    if (newValue) {
      await openMauxForm()
    }
  })

  return {
    showMauxForm,
    userMauxCourants,
    availableMaux,
    selectedMauxIds,
    mauxLoading,
    mauxSaving,
    mauxError,
    mauxSuccess,
    loadUserMauxCourants,
    saveMauxCourants,
    cancelMauxForm
  }
}

// Utilisation des composables
const { 
  showCreateForm, 
  createError, 
  createSuccess, 
  newProfil, 
  resetForm: resetCreateForm, 
  submitForm: handleCreateProfil 
} = useCreateProfilForm()

const { 
  showProfilSwitch, 
  selectProfil 
} = useProfilSwitch()

const { 
  deleteProfil: handleDeleteProfil, 
  logout: handleLogout 
} = useProfilActions()

const {
  showMauxForm,
  userMauxCourants,
  availableMaux,
  selectedMauxIds,
  mauxLoading,
  mauxSaving,
  mauxError,
  mauxSuccess,
  loadUserMauxCourants,
  saveMauxCourants,
  cancelMauxForm
} = useMauxCourants()

// Initialisation
onMounted(async () => {
  // Vérifier l'authentification
  await authStore.checkAuth()
  if (!authStore.isLoggedIn) {
    await navigateTo('/login')
    return
  }
  
  // Charger les profils et les maux courants
  await initProfils()
  await loadUserMauxCourants()
})
</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
</style> 