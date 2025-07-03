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
      const { Produit } = await import('~/server/database')
      
      // Configuration de la pagination
      const offset = (page - 1) * limit
      
      // Configuration de la recherche
      const whereClause = search ? {
        [Op.or]: [
          { Nom_Commun: { [Op.like]: `%${search}%` } },
          { Nom_Scientifique: { [Op.like]: `%${search}%` } },
          { Famille_Botanique: { [Op.like]: `%${search}%` } }
        ]
      } : {}
      
      // Récupérer les produits avec pagination
      const { rows: produits, count: total } = await Produit.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })

      return {
        success: true,
        produits: produits.map(produit => ({
          id: produit.id,
          nom: produit.Nom_Commun,
          nomScientifique: produit.Nom_Scientifique,
          famille: produit.Famille_Botanique,
          partie: produit.Partie_Plante,
          composition: produit.Composition,
          formeGalenique: produit.Forme_Galenique,
          proprietesPrincipales: produit.Propriete_Principale,
          proprietesSecondaires: produit.Propriete_Secondaire,
          utilisation: produit.Utilisation,
          precautions: produit.Precautions,
          source: produit.Source,
          imageUrl: produit.Image_url,
          createdAt: produit.createdAt,
          updatedAt: produit.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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