import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    const body = await readBody(event)
    const { mauxIds, action = 'replace' }: { 
      mauxIds: number[], 
      action?: 'replace' | 'add' | 'remove' 
    } = body
    
    console.log('🔍 [MAUX-COURANTS] Action:', action, 'pour utilisateur:', IdUser)
    console.log('📝 [MAUX-COURANTS] Maux IDs:', mauxIds)
    
    // Validation
    if (!Array.isArray(mauxIds)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'mauxIds doit être un tableau'
      })
    }
    
    try {
      const { User, Maux, UserMauxCourants } = await import('~/server/database')
      
      // Vérifier que tous les maux existent
      if (mauxIds.length > 0) {
        const mauxExistants = await Maux.findAll({
          where: { id: mauxIds },
          attributes: ['id']
        })
        
        const idsExistants = mauxExistants.map((m: any) => m.id)
        const idsInexistants = mauxIds.filter(id => !idsExistants.includes(id))
        
        if (idsInexistants.length > 0) {
          throw createError({
            statusCode: 400,
            statusMessage: `Maux inexistants: ${idsInexistants.join(', ')}`
          })
        }
      }
      
      let result
      
      switch (action) {
        case 'replace':
          // Supprimer tous les maux courants existants
          await UserMauxCourants.destroy({
            where: { IdUser }
          })
          
          // Ajouter les nouveaux maux
          if (mauxIds.length > 0) {
            const mauxACreer = mauxIds.map((IdMal, index) => ({
              IdUser,
              IdMal,
              priorite: Math.max(1, 6 - index), // Priorité décroissante selon l'ordre
              frequence: 'occasionnel'
            }))
            
            await UserMauxCourants.bulkCreate(mauxACreer)
          }
          
          result = `${mauxIds.length} mal(aux) courant(s) défini(s)`
          break
          
        case 'add':
          // Ajouter seulement les nouveaux maux (éviter les doublons)
          const mauxExistantsUser = await UserMauxCourants.findAll({
            where: { IdUser, IdMal: mauxIds },
            attributes: ['IdMal']
          })
          
          const idsDejaAjoutes = mauxExistantsUser.map((m: any) => m.IdMal)
          const nouveauxIds = mauxIds.filter(id => !idsDejaAjoutes.includes(id))
          
          if (nouveauxIds.length > 0) {
            const mauxACreer = nouveauxIds.map(IdMal => ({
              IdUser,
              IdMal,
              priorite: 3, // Priorité moyenne
              frequence: 'occasionnel'
            }))
            
            await UserMauxCourants.bulkCreate(mauxACreer)
          }
          
          result = `${nouveauxIds.length} nouveau(x) mal(aux) ajouté(s)`
          break
          
        case 'remove':
          // Supprimer les maux spécifiés
          const deleted = await UserMauxCourants.destroy({
            where: { IdUser, IdMal: mauxIds }
          })
          
          result = `${deleted} mal(aux) supprimé(s)`
          break
          
        default:
          throw createError({
            statusCode: 400,
            statusMessage: 'Action non valide. Utilisez: replace, add, ou remove'
          })
      }
      
      console.log('✅ [MAUX-COURANTS] Succès:', result)
      
      return {
        success: true,
        message: result,
        action,
        mauxIds
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
      statusMessage: 'Erreur serveur lors de la gestion des maux courants'
    })
  }
}) 