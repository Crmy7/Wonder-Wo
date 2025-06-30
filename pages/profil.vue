<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-green-800 mb-2">Wonder Wo</h1>
        <h2 class="text-2xl font-semibold text-gray-700">Gestion des Profils Familiaux</h2>
        <p class="text-gray-600 mt-2">Créez des profils pour chaque membre de votre famille</p>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Mes Profils</h3>
            <p class="text-gray-600">{{ profils.length }} profil(s) configuré(s)</p>
          </div>
          <div class="space-x-4">
            <button
              @click="showCreateForm = !showCreateForm"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <span v-if="showCreateForm">Annuler</span>
              <span v-else">+ Ajouter un profil</span>
            </button>
            <button
              @click="handleLogout"
              :disabled="loading"
              class="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <!-- Formulaire de création -->
      <div v-if="showCreateForm" class="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau profil</h3>
        
        <form @submit.prevent="handleCreateProfil" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <!-- Nom -->
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                Nom / Prénom
              </label>
              <input
                id="nom"
                v-model="newProfil.nom"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ex: Marie, Papa, Maman..."
              />
            </div>
            
            <!-- Âge -->
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
                Âge
              </label>
              <input
                id="age"
                v-model="newProfil.age"
                type="number"
                min="0"
                max="120"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ex: 35"
              />
            </div>
          </div>
          
          <!-- Options spéciales -->
          <div class="space-y-3">
            <div class="flex items-center">
              <input
                id="grossesse"
                v-model="newProfil.grossesse"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="grossesse" class="ml-2 text-sm text-gray-900">
                Enceinte (pour des recommandations adaptées)
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="enfants"
                v-model="newProfil.enfants"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="enfants" class="ml-2 text-sm text-gray-900">
                A des enfants (pour des conseils familiaux)
              </label>
            </div>
          </div>
          
          <!-- Messages -->
          <div v-if="createError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ createError }}</p>
          </div>
          
          <div v-if="createSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-700 text-sm">{{ createSuccess }}</p>
          </div>
          
          <!-- Boutons -->
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="createLoading"
              class="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <span v-if="createLoading">Création...</span>
              <span v-else>Créer le profil</span>
            </button>
            
            <button
              type="button"
              @click="resetCreateForm"
              class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des profils -->
      <div class="space-y-4">
        <div v-if="profils.length === 0" class="bg-white p-8 rounded-xl shadow-lg text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            👨‍👩‍👧‍👦
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun profil créé</h3>
          <p class="text-gray-600 mb-4">Commencez par créer un profil pour recevoir des recommandations personnalisées</p>
          <button
            @click="showCreateForm = true"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Créer mon premier profil
          </button>
        </div>

        <!-- Profils existants -->
        <div v-for="profil in profils" :key="profil.id" class="bg-white p-6 rounded-xl shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ profil.nom }}</h3>
                <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  {{ profil.age }} ans
                </span>
              </div>
              
              <div class="flex space-x-4 text-sm text-gray-600">
                <span v-if="profil.grossesse" class="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                  🤱 Enceinte
                </span>
                <span v-if="profil.enfants" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  👶 Parent
                </span>
                <span v-if="!profil.grossesse && !profil.enfants" class="text-gray-500">
                  Profil standard
                </span>
              </div>
            </div>
            
            <button
              @click="handleDeleteProfil(profil.id)"
              :disabled="deleteLoading"
              class="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">🚀 Prochaines étapes</h3>
        <div class="space-y-2 text-gray-600">
          <p>✨ Recherche de remèdes personnalisés par profil</p>
          <p>🌿 Recommandations IA adaptées à l'âge et situation</p>
          <p>📦 Gestion du placard virtuel</p>
          <p>📚 Bibliothèque de remèdes naturels</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
definePageMeta({
  layout: false
})

// État global
const loading = ref(false)
const profils = ref([])

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
  loading.value = true
  
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
    
    await navigateTo('/')
    
  } catch (error) {
    console.error('Erreur déconnexion:', error)
  } finally {
    loading.value = false
  }
}
</script> 