import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  const commentId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!commentId || isNaN(parseInt(commentId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de commentaire invalide'
    })
  }
  
  const { action } = body
  
  if (!action || !['approve', 'reject', 'delete'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action invalide. Utilisez: approve, reject, delete'
    })
  }
  
  try {
    const { Comments } = await import('~/server/database')
    
    const comment = await Comments.findByPk(parseInt(commentId))
    
    if (!comment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Commentaire non trouvé'
      })
    }
    
    if (action === 'delete') {
      // Supprimer le commentaire
      await comment.destroy()
      
      return {
        success: true,
        message: 'Commentaire supprimé avec succès'
      }
    } else {
      // Changer le statut du commentaire
      const newStatus = action === 'approve' ? 'approved' : 'rejected'
      
      await comment.update({
        status: newStatus,
        updatedAt: new Date()
      })
      
      return {
        success: true,
        message: `Commentaire ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`,
        comment: {
          id: (comment as any).id,
          status: newStatus,
          updated_at: (comment as any).updatedAt
        }
      }
    }
    
  } catch (dbError) {
    console.error('Erreur modération commentaire:', dbError)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la modération du commentaire'
    })
  }
}) 