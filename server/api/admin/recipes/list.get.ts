import { requireAdmin } from '~/server/utils/auth-middleware'
import { Op } from 'sequelize'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const search = query.search as string || ''
  
  try {
    const { Recettes, Produit, Maux, Comments } = await import('~/server/database')
    
    // Construire la condition de recherche
    const whereCondition: any = {}
    if (search) {
      whereCondition.Recette = {
        [Op.like]: `%${search}%`
      }
    }
    
    // Compter le total
    const total = await Recettes.count({
      where: whereCondition
    })
    
    // Récupérer les recettes avec pagination
    const offset = (page - 1) * limit
    const recipes = await Recettes.findAll({
      where: whereCondition,
      include: [
        {
          model: Produit,
          as: 'produits',
          attributes: ['id', 'Nom_Commun'],
          through: { attributes: [] }
        },
        {
          model: Maux,
          as: 'maux', 
          attributes: ['id', 'Symptom'],
          through: { attributes: [] }
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    
    // Récupérer les statistiques de commentaires pour toutes les recettes
    const recipeIds = recipes.map((r: any) => r.id)
    const commentsStats = await Comments.findAll({
      where: {
        entity_type: 'recette',
        entity_id: recipeIds,
        status: 'approved',
        rating: { [Op.ne]: null }
      },
      attributes: [
        'entity_id',
        [Comments.sequelize.fn('AVG', Comments.sequelize.col('rating')), 'average_rating'],
        [Comments.sequelize.fn('COUNT', '*'), 'ratings_count']
      ],
      group: ['entity_id'],
      raw: true
    })
    
    // Créer un map des statistiques par recette
    const statsMap = commentsStats.reduce((acc: any, stat: any) => {
      acc[stat.entity_id] = {
        average_rating: parseFloat(stat.average_rating) || 0,
        ratings_count: parseInt(stat.ratings_count) || 0
      }
      return acc
    }, {})
    
    return {
      recipes: recipes.map((recipe: any) => ({
        id: recipe.id,
        type_remede: recipe.Type_Remede,
        type_application: recipe.Type_Application,
        recette: recipe.Recette,
        tranche_age: recipe.Tranche_age,
        femme_enceinte: recipe.Femme_Enceinte,
        source_documentaire: recipe.Source_Documentaire,
        efficacite: recipe.Efficacite,
        produits: recipe.produits || [],
        maux: recipe.maux || [],
        created_at: recipe.createdAt,
        updated_at: recipe.updatedAt,
        // Statistiques des commentaires
        rating: statsMap[recipe.id] || { average_rating: 0, ratings_count: 0 }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
    
  } catch (dbError) {
    console.error('❌ [ADMIN RECIPES] Erreur base de données détaillée:', {
      message: dbError.message,
      code: dbError.code,
      sql: dbError.sql,
      stack: process.env.NODE_ENV === 'development' ? dbError.stack : 'Stack masqué en production'
    })
    
    // En développement, montrer l'erreur complète
    if (process.env.NODE_ENV === 'development') {
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur DB: ${dbError.message}`,
        data: {
          error_code: dbError.code,
          sql_error: dbError.sql || 'N/A'
        }
      })
    }
    
    // En production, fallback silencieux avec log
    return {
      recipes: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }
  }
}) 