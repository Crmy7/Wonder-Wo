import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const status = query.status as string || ''
  const entityType = query.entity_type as string || ''
  
  try {
    const { Comments, User, Produit, Recettes } = await import('~/server/database')
    
    // Construire les conditions de recherche
    const whereConditions: any = {}
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereConditions.status = status
    }
    
    if (entityType && ['produit', 'recette'].includes(entityType)) {
      whereConditions.entity_type = entityType
    }
    
    const offset = (page - 1) * limit
    
    // Récupérer les commentaires avec pagination
    const { count, rows: comments } = await Comments.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })
    
    // Enrichir avec les détails des entités
    const enrichedComments = await Promise.all(
      comments.map(async (comment: any) => {
        let entityDetails = null
        
        try {
          if (comment.entity_type === 'produit') {
            const produit = await Produit.findByPk(comment.entity_id, {
              attributes: ['id', 'Nom_Commun', 'nomScientifique']
            })
            entityDetails = produit ? {
              id: produit.id,
              nom: (produit as any).Nom_Commun,
              nomScientifique: (produit as any).nomScientifique
            } : null
          } else if (comment.entity_type === 'recette') {
            const recette = await Recettes.findByPk(comment.entity_id, {
              attributes: ['id', 'recette', 'type_remede']
            })
            entityDetails = recette ? {
              id: recette.id,
              nom: `Recette #${recette.id}`,
              description: (recette as any).recette?.substring(0, 100) + '...'
            } : null
          }
        } catch (error) {
          console.error('Erreur enrichissement commentaire:', error)
        }
        
        return {
          id: comment.id,
          content: comment.content,
          rating: comment.rating,
          status: comment.status,
          entity_type: comment.entity_type,
          entity_id: comment.entity_id,
          entity_details: entityDetails,
          created_at: comment.createdAt,
          updated_at: comment.updatedAt,
          user: {
            id: comment.user.id,
            email: comment.user.email
          }
        }
      })
    )
    
    const totalPages = Math.ceil(count / limit)
    
    // Statistiques générales
    const stats = await Comments.findAll({
      attributes: [
        ['status', 'status'],
        [Comments.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status'],
      raw: true
    })
    
    const statusStats = stats.reduce((acc: any, stat: any) => {
      acc[stat.status] = parseInt(stat.count)
      return acc
    }, { pending: 0, approved: 0, rejected: 0 })
    
    return {
      comments: enrichedComments,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        total: count,
        ...statusStats
      }
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des commentaires'
    })
  }
}) 