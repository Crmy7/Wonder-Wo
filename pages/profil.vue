<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-3">Wonder Wo</h1>
        <h2 class="text-xl font-medium text-grey-black mb-2">Profils Familiaux</h2>
        <p class="accent-text text-3xl">Créez des profils personnalisés pour chaque membre</p>
      </div>

      <!-- Actions -->
      <div class="bg-blanc/30 backdrop-blur-sm p-6 rounded-2xl border border-beige mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 class="text-xl font-semibold mb-1">Mes Profils</h3>
            <p class="text-3xl accent-text">{{ profils.length }} profil(s)</p>
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
            <div class="flex items-center p-3 bg-blanc/20 rounded-xl">
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
            
            <div class="flex items-center p-3 bg-blanc/20 rounded-xl">
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
              :disabled="createLoading"
              class="primary-btn flex-1"
            >
              <span v-if="createLoading">Création...</span>
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
        <div v-if="profils.length === 0" class="bg-blanc p-8 rounded-2xl border border-beige text-center">
          <div class="w-20 h-20 bg-blanc/40 rounded-full flex items-center justify-center mx-auto mb-6">
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
              </div>
              
              <div class="flex flex-wrap gap-2 text-sm">
                <span v-if="profil.grossesse" class="bg-blanc text-grey-black px-3 py-1 rounded-full flex items-center gap-1">
                  🤱 <span class="font-hashtag text-xl">Enceinte</span>
                </span>
                <span v-if="profil.enfants" class="bg-blanc text-grey-black px-3 py-1 rounded-full flex items-center gap-1">
                  👨‍👩‍👧‍👦 <span class="font-hashtag text-xl">Parent</span>
                </span>
                <span v-if="!profil.grossesse && !profil.enfants" class="accent-text-primary text-xl">
                  Profil standard
                </span>
              </div>
            </div>
            
            <button
              @click="handleDeleteProfil(profil.id)"
              :disabled="deleteLoading"
              class="text-secondary hover:text-primary text-sm font-medium transition-colors opacity-60 group-hover:opacity-100"
            >
              Supprimer
            </button>
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
// Configuration de la page
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Store d'authentification
const authStore = useAuthStore()

// État global
const loading = ref(false)
const profils = ref<any[]>([])

// Formulaire de création
const showCreateForm = ref(false)
const createLoading = ref(false)
const createError = ref('')
const createSuccess = ref('')
const deleteLoading = ref(false)

const newProfil = reactive({
  nom: '',
  age: '',
  grossesse: false,
  enfants: false
})

// Charger les profils au montage
onMounted(async () => {
  // Vérifier l'authentification
  await authStore.checkAuth()
  if (!authStore.isLoggedIn) {
    await navigateTo('/login')
    return
  }
  
  await loadProfils()
})

// Charger les profils
const loadProfils = async () => {
  try {
    const data = await $fetch('/api/profil/list')
    profils.value = data.profils || []
  } catch (error: any) {
    console.error('Erreur chargement profils:', error)
    // En cas d'erreur auth, rediriger vers login
    if (error.statusCode === 401) {
      await navigateTo('/login')
    }
  }
}

// Créer un profil
const handleCreateProfil = async () => {
  createError.value = ''
  createSuccess.value = ''
  createLoading.value = true
  
  try {
    const data = await $fetch('/api/profil/create', {
      method: 'POST',
      body: {
        nom: newProfil.nom,
        age: parseInt(newProfil.age),
        grossesse: newProfil.grossesse,
        enfants: newProfil.enfants
      }
    })
    
    createSuccess.value = data.message
    
    // Recharger la liste et réinitialiser le formulaire
    await loadProfils()
    resetCreateForm()
    
    // Masquer le formulaire après 2 secondes
    setTimeout(() => {
      showCreateForm.value = false
    }, 2000)
    
  } catch (error: any) {
    console.error('Erreur création profil:', error)
    createError.value = error.statusMessage || 'Erreur lors de la création du profil'
  } finally {
    createLoading.value = false
  }
}

// Supprimer un profil
const handleDeleteProfil = async (profilId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
    return
  }
  
  deleteLoading.value = true
  
  try {
    await $fetch(`/api/profil/${profilId}`, {
      method: 'DELETE'
    })
    
    // Recharger la liste
    await loadProfils()
    
  } catch (error: any) {
    console.error('Erreur suppression profil:', error)
    alert('Erreur lors de la suppression du profil')
  } finally {
    deleteLoading.value = false
  }
}

// Réinitialiser le formulaire
const resetCreateForm = () => {
  newProfil.nom = ''
  newProfil.age = ''
  newProfil.grossesse = false
  newProfil.enfants = false
  createError.value = ''
  createSuccess.value = ''
}

// Déconnexion
const handleLogout = async () => {
  try {
    await authStore.logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Erreur déconnexion:', error)
  }
}
</script> 