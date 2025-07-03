export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.entity_type || !body.entity_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type d\'entité et ID requis'
    })
  }
  
  if (!['produit', 'recette'].includes(body.entity_type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type d\'entité invalide (produit ou recette)'
    })
  }
  
  try {
    const { Comments, User } = await import('~/server/database')
    
    const comments = await Comments.findAll({
      where: {
        entity_type: body.entity_type,
        entity_id: parseInt(body.entity_id),
        status: 'approved'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    
    // Calculer la moyenne des notes
    const ratings = comments.filter((comment: any) => comment.rating).map((comment: any) => comment.rating)
    const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0
    
    return {
      comments: comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        rating: comment.rating,
        created_at: comment.createdAt,
        user: {
          id: comment.user.id,
          email: comment.user.email.split('@')[0] // Masquer une partie de l'email
        }
      })),
      stats: {
        total: comments.length,
        average_rating: Math.round(averageRating * 10) / 10,
        ratings_count: ratings.length
      }
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    return {
      comments: [],
      stats: {
        total: 0,
        average_rating: 0,
        ratings_count: 0
      }
    }
  }
}) 