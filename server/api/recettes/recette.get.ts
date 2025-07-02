import { Produit } from '~/server/database'
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
      const { Produit } = await import('~/server/database')
      
      // Vérifier si le produit est dans le placard de l'utilisateur
      const ProduitItem = await Produit.findOne({
        where: { 
          IdProduit: parseInt(productId),
        }
      })

      return {
        success: true,
        inPlacard: !!ProduitItem
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour le produit')
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