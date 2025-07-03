import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id || isNaN(parseInt(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de recette invalide'
    })
  }
  
  try {
    const { Recettes } = await import('~/server/database')
    
    // Vérifier que la recette existe
    const recipe = await Recettes.findByPk(parseInt(id))
    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recette non trouvée'
      })
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (body.type_remede !== undefined) updateData.Type_Remede = body.type_remede
    if (body.type_application !== undefined) updateData.Type_Application = body.type_application
    if (body.recette !== undefined) updateData.Recette = body.recette
    if (body.tranche_age !== undefined) updateData.Tranche_age = body.tranche_age
    if (body.femme_enceinte !== undefined) updateData.Femme_Enceinte = body.femme_enceinte
    if (body.source_documentaire !== undefined) updateData.Source_Documentaire = body.source_documentaire
    if (body.efficacite !== undefined) updateData.Efficacite = body.efficacite
    
    // Mettre à jour la recette
    await (recipe as any).update(updateData)
    
    // Récupérer la recette mise à jour avec ses relations
    const updatedRecipe = await Recettes.findByPk(parseInt(id), {
      include: [
                 {
           model: (await import('~/server/database')).Produit,
           as: 'produits',
           attributes: ['id', 'Nom_Commun'],
           through: { attributes: [] }
         },
         {
           model: (await import('~/server/database')).Maux,
           as: 'maux',
           attributes: ['id', 'Symptom'],
           through: { attributes: [] }
         }
      ]
    })
    
    return {
      success: true,
      recipe: {
        id: (updatedRecipe as any).id,
        type_remede: (updatedRecipe as any).Type_Remede,
        type_application: (updatedRecipe as any).Type_Application,
        recette: (updatedRecipe as any).Recette,
        tranche_age: (updatedRecipe as any).Tranche_age,
        femme_enceinte: (updatedRecipe as any).Femme_Enceinte,
        source_documentaire: (updatedRecipe as any).Source_Documentaire,
        efficacite: (updatedRecipe as any).Efficacite,
        produits: (updatedRecipe as any).produits || [],
        maux: (updatedRecipe as any).maux || [],
        updated_at: (updatedRecipe as any).updatedAt
      }
    }
    
  } catch (error: any) {
    console.error('Erreur modification recette:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la modification de la recette'
    })
  }
}) 