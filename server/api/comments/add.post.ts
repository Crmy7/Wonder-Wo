import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier l'authentification
  const userId = await getCurrentUser(event)
  
  const body = await readBody(event)
  
  // Validation des données
  if (!body.entity_type || !body.entity_id || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type d\'entité, ID et contenu requis'
    })
  }
  
  if (!['produit', 'recette'].includes(body.entity_type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type d\'entité invalide (produit ou recette)'
    })
  }
  
  if (body.rating && (body.rating < 1 || body.rating > 5)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La note doit être entre 1 et 5'
    })
  }
  
  try {
    const { Comments, User } = await import('~/server/database')
    
    // Créer le commentaire
    const comment = await Comments.create({
      entity_type: body.entity_type,
      entity_id: parseInt(body.entity_id),
      user_id: userId,
      content: body.content.trim(),
      rating: body.rating ? parseInt(body.rating) : null,
      status: 'approved' // Auto-approuvé pour l'instant
    })
    
    // Récupérer le commentaire avec les infos utilisateur
    const fullComment = await Comments.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email']
        }
      ]
    })
    
    return {
      success: true,
      comment: {
        id: (fullComment as any).id,
        content: (fullComment as any).content,
        rating: (fullComment as any).rating,
        created_at: (fullComment as any).createdAt,
        user: {
          id: (fullComment as any).user.id,
          email: (fullComment as any).user.email.split('@')[0]
        }
      },
      message: 'Commentaire ajouté avec succès'
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'ajout du commentaire'
    })
  }
}) 