import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    console.log('🔍 [MAUX-COURANTS] Récupération pour utilisateur:', IdUser)
    
    try {
      const { User, Maux, UserMauxCourants } = await import('~/server/database')
      
      // Récupérer les maux courants de l'utilisateur avec les détails
      const mauxCourants = await UserMauxCourants.findAll({
        where: { IdUser },
        include: [
          {
            model: Maux,
            as: 'mal',
            attributes: ['id', 'Symptom']
          }
        ],
        order: [
          ['priorite', 'DESC'], // Priorité décroissante
          ['createdAt', 'ASC']   // Puis par ancienneté
        ],
        raw: false
      })
      
      console.log('✅ [MAUX-COURANTS] Trouvés:', mauxCourants.length)
      
      // Formater les résultats
      const mauxFormates = mauxCourants.map((item: any) => ({
        id: item.mal.id,
        symptom: item.mal.Symptom,
        frequence: item.frequence,
        priorite: item.priorite,
        dateAjout: item.createdAt
      }))
      
      return {
        success: true,
        mauxCourants: mauxFormates,
        count: mauxFormates.length,
        message: `${mauxFormates.length} mal(aux) courant(s) trouvé(s)`
      }
      
    } catch (dbError: any) {
      console.error('❌ [MAUX-COURANTS] Erreur base de données:', dbError.message)
      throw createError({
        statusCode: 503,
        statusMessage: 'Base de données non disponible'
      })
    }
    
  } catch (error: any) {
    console.error('❌ [MAUX-COURANTS] Erreur générale:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des maux courants'
    })
  }
}) 