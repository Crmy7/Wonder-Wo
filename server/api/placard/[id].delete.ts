import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    const itemId = getRouterParam(event, 'id')
    
    if (!itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'élément requis'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { Placard } = await import('~/server/database')
      
      // Vérifier que l'élément appartient à l'utilisateur
      const placardItem = await Placard.findOne({
        where: { 
          id: parseInt(itemId),
          IdUser 
        }
      })

      if (!placardItem) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Produit non trouvé dans votre placard'
        })
      }

      // Supprimer l'élément du placard
      await placardItem.destroy()

      return {
        success: true,
        message: 'Produit retiré du placard avec succès'
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour placard')
      throw createError({
        statusCode: 500,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('Erreur suppression placard:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la suppression du placard'
    })
  }
})