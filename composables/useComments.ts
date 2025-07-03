interface Comment {
  id: number
  content: string
  rating: number | null
  created_at: string
  user: {
    id: number
    email: string
  }
}

interface CommentStats {
  total: number
  average_rating: number
  ratings_count: number
}

interface CommentsResponse {
  comments: Comment[]
  stats: CommentStats
}

export const useComments = () => {
  // État réactif
  const comments = ref<Comment[]>([])
  const stats = ref<CommentStats>({
    total: 0,
    average_rating: 0,
    ratings_count: 0
  })
  const loading = ref(false)
  const error = ref('')

  // Charger les commentaires d'une entité
  const loadComments = async (entityType: 'produit' | 'recette', entityId: number) => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('💬 [COMMENTS] Chargement commentaires', entityType, entityId)
      
      const response = await $fetch<CommentsResponse>('/api/comments/list', {
        method: 'POST',
        body: {
          entity_type: entityType,
          entity_id: entityId
        }
      })
      
      console.log('💬 [COMMENTS] Commentaires chargés:', response)
      
      comments.value = response.comments
      stats.value = response.stats
      
      return response
      
    } catch (err: any) {
      console.error('❌ [COMMENTS] Erreur chargement:', err)
      error.value = err.statusMessage || 'Erreur lors du chargement des commentaires'
      comments.value = []
      stats.value = { total: 0, average_rating: 0, ratings_count: 0 }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Ajouter un commentaire
  const addComment = async (
    entityType: 'produit' | 'recette', 
    entityId: number, 
    content: string, 
    rating?: number
  ) => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('💬 [COMMENTS] Ajout commentaire:', { entityType, entityId, content, rating })
      
      const response = await $fetch('/api/comments/add', {
        method: 'POST',
        body: {
          entity_type: entityType,
          entity_id: entityId,
          content,
          rating
        }
      })
      
      console.log('💬 [COMMENTS] Commentaire ajouté:', response)
      
      // Ajouter le nouveau commentaire en tête de liste
      comments.value.unshift(response.comment)
      
      // Recalculer les stats
      await loadComments(entityType, entityId)
      
      return response
      
    } catch (err: any) {
      console.error('❌ [COMMENTS] Erreur ajout:', err)
      error.value = err.statusMessage || 'Erreur lors de l\'ajout du commentaire'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Effacer les erreurs
  const clearError = () => {
    error.value = ''
  }

  // Réinitialiser les données
  const reset = () => {
    comments.value = []
    stats.value = { total: 0, average_rating: 0, ratings_count: 0 }
    error.value = ''
  }

  // Computed pour les statistiques formatées
  const formattedStats = computed(() => ({
    hasComments: stats.value.total > 0,
    hasRatings: stats.value.ratings_count > 0,
    averageStars: Math.round(stats.value.average_rating),
    ratingText: stats.value.average_rating > 0 
      ? `${stats.value.average_rating}/5 (${stats.value.ratings_count} ${stats.value.ratings_count === 1 ? 'note' : 'notes'})`
      : 'Aucune note',
    commentsText: stats.value.total === 0 
      ? 'Aucun commentaire'
      : `${stats.value.total} ${stats.value.total === 1 ? 'commentaire' : 'commentaires'}`
  }))

  // Helper pour formater les dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper pour générer les étoiles
  const getStarRating = (rating: number | null) => {
    if (!rating) return []
    return Array.from({ length: 5 }, (_, i) => ({
      filled: i < rating,
      index: i + 1
    }))
  }

  return {
    // État
    comments: readonly(comments),
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    formattedStats,
    
    // Actions
    loadComments,
    addComment,
    clearError,
    reset,
    
    // Helpers
    formatDate,
    getStarRating
  }
} 