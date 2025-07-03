import { requireAdmin } from '~/server/utils/auth-middleware'
import { Op } from 'sequelize'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier les droits admin
    await requireAdmin(event)

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string || ''
    
    try {
      const { Produit, Comments } = await import('~/server/database')
      
      // Configuration de la pagination
      const offset = (page - 1) * limit
      
      // Configuration de la recherche
      const whereClause = search ? {
        [Op.or]: [
          { Nom_Commun: { [Op.like]: `%${search}%` } },
          { Nom_Scientifique: { [Op.like]: `%${search}%` } },
          { Famille_Botanique: { [Op.like]: `%${search}%` } },
          { Propriete_Principale: { [Op.like]: `%${search}%` } }
        ]
      } : {}
      
      // Récupérer les produits avec pagination
      const { rows: produits, count: total } = await Produit.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['updatedAt', 'DESC']]
      })

      // Récupérer les statistiques de commentaires pour tous les produits
      const productIds = produits.map((p: any) => p.id)
      const commentsStats = await Comments.findAll({
        where: {
          entity_type: 'produit',
          entity_id: productIds,
          status: 'approved',
          rating: { [Comments.sequelize.Op.ne]: null }
        },
        attributes: [
          'entity_id',
          [Comments.sequelize.fn('AVG', Comments.sequelize.col('rating')), 'average_rating'],
          [Comments.sequelize.fn('COUNT', '*'), 'ratings_count']
        ],
        group: ['entity_id'],
        raw: true
      })
      
      // Créer un map des statistiques par produit
      const statsMap = commentsStats.reduce((acc: any, stat: any) => {
        acc[stat.entity_id] = {
          average_rating: parseFloat(stat.average_rating) || 0,
          ratings_count: parseInt(stat.ratings_count) || 0
        }
        return acc
      }, {})
      
      // Enrichir les produits avec leurs statistiques
      const enrichedProducts = produits.map((product: any) => ({
        id: product.id,
        nom: product.Nom_Commun,
        nomScientifique: product.Nom_Scientifique,
        famille: product.Famille_Botanique,
        partie: product.Partie_Plante,
        composition: product.Composition,
        formeGalenique: product.Forme_Galenique,
        proprietesPrincipales: product.Propriete_Principale,
        proprietesSecondaires: product.Propriete_Secondaire,
        utilisation: product.Utilisation,
        precautions: product.Precautions,
        source: product.Source,
        imageUrl: product.Image_url,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        // Statistiques des commentaires
        rating: statsMap[product.id] || { average_rating: 0, ratings_count: 0 }
      }))
      
      const totalPages = Math.ceil(total / limit)
      
      return {
        success: true,
        produits: enrichedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour la liste des produits')
      
      // Fallback avec données de démonstration
      const mockProduits = [
        {
          id: 1,
          nom: 'Lavande',
          nomScientifique: 'Lavandula angustifolia',
          famille: 'Lamiacées',
          partie: 'Fleurs',
          composition: 'Huile essentielle, tanins, flavonoïdes',
          formeGalenique: 3,
          proprietesPrincipales: 'Calmante, relaxante',
          proprietesSecondaires: 'Antiseptique, cicatrisante',
          utilisation: 'Diffusion, massage',
          precautions: 'Éviter chez la femme enceinte',
          source: 'Pharmacopée européenne',
          imageUrl: '🌿',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      return {
        success: true,
        produits: mockProduits,
        pagination: {
          page: 1,
          limit: 20,
          total: mockProduits.length,
          totalPages: 1
        },
        message: 'Mode développement - données de démonstration'
      }
    }

  } catch (error: any) {
    console.error('Erreur liste produits admin:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des produits'
    })
  }
}) 