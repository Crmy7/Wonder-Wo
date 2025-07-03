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
    const { Recettes, Produit, Maux } = await import('~/server/database')
    
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
        updated_at: recipe.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    // Fallback avec données par défaut
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