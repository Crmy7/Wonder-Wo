import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)

    // Essayer la base de données d'abord
    try {
      const { Placard } = await import('~/server/database')
      
      // Compter les éléments avant suppression
      const count = await Placard.count({
        where: { IdUser }
      })

      // Supprimer tous les éléments du placard de l'utilisateur
      await Placard.destroy({
        where: { IdUser }
      })

      return {
        success: true,
        deletedCount: count,
        message: `${count} produit(s) retiré(s) du placard`
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour placard')
      throw createError({
        statusCode: 500,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('Erreur vidage placard:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors du vidage du placard'
    })
  }
})