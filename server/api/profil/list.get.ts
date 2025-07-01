import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)

    // Essayer la base de données d'abord
    try {
      const { Profil } = await import('~/server/database')
      
      // Récupérer les profils de l'utilisateur
      const profils = await Profil.findAll({
        where: { IdUser },
        order: [['createdAt', 'ASC']]
      })

      return {
        success: true,
        profils: profils.map((profil: any) => ({
          id: profil.id,
          nom: profil.nom,
          age: profil.age,
          grossesse: profil.grossesse,
          enfants: profil.enfants,
          createdAt: profil.createdAt
        })),
        count: profils.length
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour profils')
      return {
        success: true,
        profils: [],
        count: 0,
        message: 'Base de données non disponible - mode développement'
      }
    }

  } catch (error: any) {
    console.error('Erreur récupération profils:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des profils'
    })
  }
}) 