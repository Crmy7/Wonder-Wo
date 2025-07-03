<template>
  <div class="bg-blanc p-6 rounded-2xl border border-beige shadow-sm">
    <!-- En-tête avec statistiques -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-semibold text-grey-black mb-2">Avis et commentaires</h3>
        <div class="flex items-center gap-4 text-sm text-grey-black/60">
          <span>{{ formattedStats.commentsText }}</span>
          <span v-if="formattedStats.hasRatings" class="flex items-center gap-1">
            <div class="flex">
              <span v-for="i in 5" :key="i" class="text-yellow-400">
                {{ i <= formattedStats.averageStars ? '★' : '☆' }}
              </span>
            </div>
            <span>{{ formattedStats.ratingText }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Formulaire d'ajout de commentaire -->
    <div v-if="authStore.isLoggedIn" class="bg-beige/30 p-4 rounded-xl mb-6">
      <h4 class="font-medium text-grey-black mb-3">Laisser un avis</h4>
      
      <form @submit.prevent="submitComment" class="space-y-4">
        <!-- Notation -->
        <div>
          <label class="block text-sm font-medium text-grey-black mb-2">Note (optionnelle)</label>
          <div class="flex gap-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="newRating = star"
              class="text-2xl transition-colors"
              :class="star <= newRating ? 'text-yellow-400' : 'text-grey-black/20'"
            >
              ★
            </button>
          </div>
        </div>

        <!-- Commentaire -->
        <div>
          <label class="block text-sm font-medium text-grey-black mb-2">Commentaire</label>
          <textarea
            v-model="newComment"
            rows="3"
            class="w-full px-3 py-2 border border-beige rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            placeholder="Partagez votre expérience..."
            required
          ></textarea>
        </div>

        <!-- Boutons -->
        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="loading || !newComment.trim()"
            class="bg-primary text-blanc px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Publication...</span>
            <span v-else>Publier</span>
          </button>
          
          <button
            v-if="newComment || newRating > 0"
            type="button"
            @click="resetForm"
            class="text-grey-black/60 hover:text-grey-black"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Message de connexion -->
    <div v-else class="bg-primary/5 p-4 rounded-xl mb-6 text-center">
      <p class="text-grey-black/70">
        <NuxtLink to="/login" class="text-primary font-medium hover:underline">
          Connectez-vous
        </NuxtLink>
        pour laisser un avis
      </p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
      <div class="flex items-center justify-between">
        <p class="text-secondary font-medium">{{ error }}</p>
        <button @click="clearError" class="text-secondary hover:text-secondary/80">✕</button>
      </div>
    </div>

    <!-- Liste des commentaires -->
    <div v-if="loading && comments.length === 0" class="text-center py-8">
      <div class="animate-pulse">
        <div class="h-4 bg-beige rounded w-1/4 mx-auto mb-4"></div>
        <div class="h-3 bg-beige rounded w-1/2 mx-auto"></div>
      </div>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8 text-grey-black/60">
      <p>Aucun commentaire pour le moment</p>
      <p class="text-sm mt-1">Soyez le premier à donner votre avis !</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-blanc border border-beige rounded-xl p-4"
      >
        <!-- En-tête du commentaire -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-sm font-bold text-primary">
                {{ comment.user.email.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="font-medium text-grey-black">{{ comment.user.email }}</p>
              <p class="text-xs text-grey-black/60">{{ formatDate(comment.created_at) }}</p>
            </div>
          </div>
          
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

        <!-- Contenu du commentaire -->
        <p class="text-grey-black leading-relaxed">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  entityType: 'produit' | 'recette'
  entityId: number
}

const props = defineProps<Props>()

// Stores
const authStore = useAuthStore()

// Composables
const {
  comments,
  stats,
  loading,
  error,
  formattedStats,
  loadComments,
  addComment,
  clearError,
  reset,
  formatDate
} = useComments()

// État local pour le formulaire
const newComment = ref('')
const newRating = ref(0)

// Charger les commentaires au montage
onMounted(() => {
  loadComments(props.entityType, props.entityId)
})

// Réinitialiser quand les props changent
watch(() => [props.entityType, props.entityId], () => {
  reset()
  loadComments(props.entityType, props.entityId)
})

// Soumettre un commentaire
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    await addComment(
      props.entityType,
      props.entityId,
      newComment.value.trim(),
      newRating.value > 0 ? newRating.value : undefined
    )
    
    // Réinitialiser le formulaire
    resetForm()
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  newComment.value = ''
  newRating.value = 0
}
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
</style> 