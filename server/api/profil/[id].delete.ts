import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const userId = await getCurrentUser(event)
    
    const profilId = getRouterParam(event, 'id')
    
    if (!profilId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du profil requis'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { Profil } = await import('~/server/database')
      
      // Vérifier que le profil appartient à l'utilisateur
      const profil = await Profil.findOne({
        where: { 
          id: parseInt(profilId),
          userId 
        }
      })

      if (!profil) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Profil non trouvé'
        })
      }

      // Supprimer le profil
      await profil.destroy()

      return {
        success: true,
        message: 'Profil supprimé avec succès'
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour profils')
      throw createError({
        statusCode: 500,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('Erreur suppression profil:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la suppression du profil'
    })
  }
}) 