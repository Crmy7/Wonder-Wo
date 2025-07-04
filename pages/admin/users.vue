<template>
  <div class="min-h-screen bg-blanc">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- En-tête -->
      <div class="bg-primary/5 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-grey-black mb-2">Gestion des Utilisateurs</h1>
            <p class="text-grey-black/60">Gérer les comptes utilisateurs et leurs rôles</p>
          </div>
          <NuxtLink 
            to="/admin" 
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors"
          >
            ← Retour admin
          </NuxtLink>
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
                placeholder="Rechercher par email..."
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
              {{ adminUsers.getTotalUsers }} utilisateur(s) trouvé(s)
            </div>
            <button
              @click="refreshUsers"
              :disabled="adminUsers.loading.value"
              class="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau des utilisateurs -->
      <div class="bg-blanc rounded-2xl border border-beige shadow-sm overflow-hidden">
        <!-- Loading state -->
        <div v-if="adminUsers.loading.value" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-grey-black/60">Chargement des utilisateurs...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="adminUsers.error.value" class="p-8 text-center">
          <div class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 max-w-md mx-auto">
            <p class="text-secondary text-sm font-medium mb-3">{{ adminUsers.error.value }}</p>
            <button 
              @click="refreshUsers"
              class="text-primary hover:underline text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Tableau -->
        <div v-else-if="adminUsers.users.value.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-beige/30 border-b border-beige">
              <tr>
                <th class="text-left py-4 px-6 font-semibold text-grey-black">ID</th>
                <th class="text-left py-4 px-6 font-semibold text-grey-black">Email</th>
                <th class="text-left py-4 px-6 font-semibold text-grey-black">Rôle</th>
                <th class="text-left py-4 px-6 font-semibold text-grey-black">Inscription</th>
                <th class="text-left py-4 px-6 font-semibold text-grey-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in adminUsers.users.value" 
                :key="user.id"
                class="border-b border-beige/50 hover:bg-beige/20 transition-colors"
              >
                <td class="py-4 px-6 text-sm text-grey-black">
                  #{{ user.id }}
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span class="text-xs font-medium text-primary">
                        {{ user.email.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <span class="font-medium text-grey-black">{{ user.email }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      user.role === 'admin' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-primary/10 text-primary'
                    ]"
                  >
                    {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-sm text-grey-black/60">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="user.role === 'user'"
                      @click="promoteToAdmin(user)"
                      :disabled="updatingUser === user.id"
                      class="bg-secondary/10 border border-secondary/20 text-secondary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/20 transition-colors disabled:opacity-50"
                    >
                      {{ updatingUser === user.id ? 'Promotion...' : 'Promouvoir admin' }}
                    </button>
                    <button
                      v-else-if="user.role === 'admin' && user.id !== authStore.user?.id"
                      @click="demoteToUser(user)"
                      :disabled="updatingUser === user.id"
                      class="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      {{ updatingUser === user.id ? 'Dégradation...' : 'Rétrograder' }}
                    </button>
                    <span 
                      v-else-if="user.id === authStore.user?.id"
                      class="text-xs text-grey-black/60 italic"
                    >
                      (Vous)
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-else class="p-8 text-center">
          <div class="w-16 h-16 bg-grey-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-lg font-semibold text-grey-black mb-2">Aucun utilisateur trouvé</h3>
          <p class="text-grey-black/60 mb-4">
            {{ searchTerm ? 'Aucun utilisateur ne correspond à votre recherche.' : 'Aucun utilisateur n\'est encore inscrit.' }}
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
        v-if="adminUsers.users.value.length > 0 && adminUsers.getTotalPages.value > 1" 
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-sm text-grey-black/60">
          Page {{ adminUsers.pagination.value.page }} sur {{ adminUsers.getTotalPages }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="previousPage"
            :disabled="!adminUsers.hasPreviousPage.value || adminUsers.loading.value"
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="!adminUsers.hasNextPage.value || adminUsers.loading.value"
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
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
const authStore = useAuthStore()
const adminUsers = useAdminUsers()

// État réactif
const searchTerm = ref('')
const updatingUser = ref<number | null>(null)

// Fonctions utilitaires
const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Recherche avec debounce simple
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      await adminUsers.searchUsers(searchTerm.value.trim())
    } else {
      await adminUsers.loadUsers()
    }
  }, 300)
}

// Actions
const refreshUsers = async () => {
  await adminUsers.loadUsers()
}

const clearSearch = async () => {
  searchTerm.value = ''
  await adminUsers.loadUsers()
}

const promoteToAdmin = async (user: any) => {
  if (confirm(`Êtes-vous sûr de vouloir promouvoir ${user.email} en tant qu'administrateur ?`)) {
    updatingUser.value = user.id
    try {
      await adminUsers.updateUserRole(user.id, 'admin')
    } catch (error) {
      console.error('Erreur promotion:', error)
    } finally {
      updatingUser.value = null
    }
  }
}

const demoteToUser = async (user: any) => {
  if (confirm(`Êtes-vous sûr de vouloir rétrograder ${user.email} en tant qu'utilisateur simple ?`)) {
    updatingUser.value = user.id
    try {
      await adminUsers.updateUserRole(user.id, 'user')
    } catch (error) {
      console.error('Erreur rétrogradation:', error)
    } finally {
      updatingUser.value = null
    }
  }
}

const previousPage = async () => {
  const currentPage = adminUsers.pagination.value.page
  if (currentPage > 1) {
    await adminUsers.loadPage(currentPage - 1)
  }
}

const nextPage = async () => {
  const currentPage = adminUsers.pagination.value.page
  const totalPages = adminUsers.getTotalPages.value
  if (currentPage < totalPages) {
    await adminUsers.loadPage(currentPage + 1)
  }
}

// Charger les utilisateurs au montage
onMounted(async () => {
  await adminUsers.loadUsers()
})

// Meta données pour le SEO
useSeoMeta({
  title: 'Gestion des utilisateurs - Administration Wonder Wo',
  description: 'Interface d\'administration pour gérer les utilisateurs',
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
</style> 