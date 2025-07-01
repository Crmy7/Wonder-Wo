import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    const body = await readBody(event)
    const { IdProduit } = body

    // Validation des données
    if (!IdProduit) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du produit requis'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { Placard, Produit } = await import('~/server/database')
      
      // Vérifier que le produit existe
      const produit: any = await Produit.findByPk(IdProduit)
      if (!produit) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Produit non trouvé'
        })
      }

      // Vérifier si le produit n'est pas déjà dans le placard
      const existingItem = await Placard.findOne({
        where: { 
          IdUser,
          IdProduit: parseInt(IdProduit)
        }
      })

      if (existingItem) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Ce produit est déjà dans votre placard'
        })
      }

      // Ajouter le produit au placard
      const placardItem: any = await Placard.create({
        IdUser,
        IdProduit: parseInt(IdProduit),
        produit: produit.Nom_Commun
      })

      return {
        success: true,
        item: {
          id: placardItem.id,
          produit: placardItem.produit,
          IdProduit: placardItem.IdProduit,
          createdAt: placardItem.createdAt
        },
        message: 'Produit ajouté au placard avec succès'
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour placard')
      throw createError({
        statusCode: 500,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('Erreur ajout placard:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de l\'ajout au placard'
    })
  }
})