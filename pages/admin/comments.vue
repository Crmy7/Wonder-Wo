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
            <span class="text-grey-black font-medium">Gestion des commentaires</span>
          </div>
          <h1 class="text-3xl font-bold text-grey-black">Gestion des commentaires</h1>
          <p class="text-grey-black/60">Modérer et gérer les avis des utilisateurs</p>
        </div>
      </div>

      <!-- Statistiques -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blanc p-4 rounded-xl border border-beige">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-grey-black/60">Total</p>
              <p class="text-2xl font-bold text-grey-black">{{ stats.total }}</p>
            </div>
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span class="text-primary">💬</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-4 rounded-xl border border-beige">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-grey-black/60">Approuvés</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.approved || 0 }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600">✓</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-4 rounded-xl border border-beige">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-grey-black/60">En attente</p>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.pending || 0 }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span class="text-yellow-600">⏳</span>
            </div>
          </div>
        </div>

        <div class="bg-blanc p-4 rounded-xl border border-beige">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-grey-black/60">Rejetés</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.rejected || 0 }}</p>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="text-red-600">✕</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-4">
            <select
              v-model="selectedStatus"
              @change="loadComments"
              class="px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="approved">Approuvés</option>
              <option value="pending">En attente</option>
              <option value="rejected">Rejetés</option>
            </select>

            <select
              v-model="selectedEntityType"
              @change="loadComments"
              class="px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Tous les types</option>
              <option value="produit">Produits</option>
              <option value="recette">Recettes</option>
            </select>
          </div>

          <button
            @click="loadComments"
            :disabled="loading"
            class="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      <!-- Liste des commentaires -->
      <div class="bg-blanc rounded-2xl border border-beige shadow-sm overflow-hidden">
        <!-- Loading state -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-grey-black/60">Chargement des commentaires...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 max-w-md mx-auto">
            <p class="text-secondary text-sm font-medium mb-3">{{ error }}</p>
            <button 
              @click="loadComments"
              class="text-primary hover:underline text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Liste des commentaires -->
        <div v-else-if="comments.length > 0" class="divide-y divide-beige">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="p-6 hover:bg-beige/30 transition-colors"
          >
            <div class="flex items-start justify-between">
              <!-- Contenu du commentaire -->
              <div class="flex-1 mr-6">
                <div class="flex items-start gap-4 mb-3">
                  <!-- Avatar utilisateur -->
                  <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm font-bold text-primary">
                      {{ comment.user.email.charAt(0).toUpperCase() }}
                    </span>
                  </div>

                  <!-- Infos utilisateur et entité -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="font-medium text-grey-black">{{ comment.user.email }}</span>
                      <span class="text-xs text-grey-black/40">
                        {{ formatDate(comment.created_at) }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                          comment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        ]"
                      >
                        {{ getStatusLabel(comment.status) }}
                      </span>
                    </div>

                    <!-- Entité commentée -->
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs bg-beige px-2 py-1 rounded-full text-grey-black/60">
                        {{ comment.entity_type === 'produit' ? '🌿' : '📋' }}
                        {{ comment.entity_type === 'produit' ? 'Produit' : 'Recette' }}
                      </span>
                      <span class="text-sm text-grey-black">
                        {{ comment.entity_details?.nom || `${comment.entity_type} #${comment.entity_id}` }}
                      </span>
                    </div>

                    <!-- Contenu du commentaire -->
                    <p class="text-grey-black leading-relaxed mb-2">{{ comment.content }}</p>

                    <!-- Note -->
                    <div v-if="comment.rating" class="flex items-center gap-1">
                      <div class="flex">
                        <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                          {{ i <= comment.rating ? '★' : '☆' }}
                        </span>
                      </div>
                      <span class="text-sm text-grey-black/60">{{ comment.rating }}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  v-if="comment.status !== 'approved'"
                  @click="moderateComment(comment.id, 'approve')"
                  :disabled="moderating === comment.id"
                  class="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  ✓ Approuver
                </button>

                <button
                  v-if="comment.status !== 'rejected'"
                  @click="moderateComment(comment.id, 'reject')"
                  :disabled="moderating === comment.id"
                  class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  ✕ Rejeter
                </button>

                <button
                  @click="moderateComment(comment.id, 'delete')"
                  :disabled="moderating === comment.id"
                  class="bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="p-8 text-center">
          <div class="w-16 h-16 bg-grey-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">💬</span>
          </div>
          <h3 class="text-lg font-semibold text-grey-black mb-2">Aucun commentaire trouvé</h3>
          <p class="text-grey-black/60">
            {{ selectedStatus || selectedEntityType ? 'Aucun commentaire ne correspond aux filtres.' : 'Aucun commentaire n\'a encore été publié.' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div 
        v-if="pagination && pagination.totalPages > 1" 
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-sm text-grey-black/60">
          Page {{ pagination.page }} sur {{ pagination.totalPages }}
          ({{ pagination.total }} commentaire{{ pagination.total > 1 ? 's' : '' }})
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="!pagination.hasPrev || loading"
            class="bg-blanc border border-beige text-grey-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-beige/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="!pagination.hasNext || loading"
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

// État réactif
const comments = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const moderating = ref<number | null>(null)
const selectedStatus = ref('')
const selectedEntityType = ref('')

const pagination = ref<any>(null)
const stats = ref<any>(null)

// Charger les commentaires
const loadComments = async (page = 1) => {
  loading.value = true
  error.value = ''
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    })
    
    if (selectedStatus.value) {
      params.append('status', selectedStatus.value)
    }
    
    if (selectedEntityType.value) {
      params.append('entity_type', selectedEntityType.value)
    }
    
    const response = await $fetch(`/api/admin/comments/list?${params.toString()}`)
    
    comments.value = response.comments
    pagination.value = response.pagination
    stats.value = response.stats
    
  } catch (err: any) {
    console.error('Erreur chargement commentaires:', err)
    error.value = err.statusMessage || 'Erreur lors du chargement des commentaires'
  } finally {
    loading.value = false
  }
}

// Modérer un commentaire
const moderateComment = async (commentId: number, action: 'approve' | 'reject' | 'delete') => {
  moderating.value = commentId
  
  try {
    const response = await $fetch(`/api/admin/comments/${commentId}/moderate`, {
      method: 'PATCH',
      body: { action }
    })
    
    if (action === 'delete') {
      // Retirer le commentaire de la liste
      comments.value = comments.value.filter(c => c.id !== commentId)
    } else {
      // Mettre à jour le statut
      const commentIndex = comments.value.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        comments.value[commentIndex].status = response.comment.status
      }
    }
    
    // Recharger les stats
    await loadComments(pagination.value?.page || 1)
    
  } catch (err: any) {
    console.error('Erreur modération:', err)
    error.value = err.statusMessage || 'Erreur lors de la modération'
  } finally {
    moderating.value = null
  }
}

// Navigation pagination
const goToPage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.totalPages || 1)) {
    loadComments(page)
  }
}

// Utilitaires
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved': return 'Approuvé'
    case 'pending': return 'En attente'
    case 'rejected': return 'Rejeté'
    default: return status
  }
}

// Charger les données au montage
onMounted(() => {
  loadComments()
})

// Meta données
useSeoMeta({
  title: 'Gestion des commentaires - Administration Wonder Wo',
  description: 'Interface d\'administration pour modérer les commentaires',
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