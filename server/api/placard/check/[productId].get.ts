import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    const productId = getRouterParam(event, 'productId')
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du produit requis'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { Placard } = await import('~/server/database')
      
      // Vérifier si le produit est dans le placard de l'utilisateur
      const placardItem = await Placard.findOne({
        where: { 
          IdProduit: parseInt(productId),
          IdUser 
        }
      })

      return {
        success: true,
        inPlacard: !!placardItem
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour placard')
      return {
        success: true,
        inPlacard: false,
        item: null,
        message: 'Base de données non disponible - mode développement'
      }
    }

  } catch (error: any) {
    console.error('Erreur vérification placard:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la vérification du placard'
    })
  }
})