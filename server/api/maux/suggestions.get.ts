import { Op } from 'sequelize'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { q } = query

    // Validation du paramètre de recherche
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return {
        success: true,
        suggestions: [],
        count: 0,
        message: 'Minimum 2 caractères requis'
      }
    }

    const searchTerm = q.trim()
    console.log('🔍 [SUGGESTIONS] Recherche suggestions pour:', searchTerm)

    try {
      const { Maux } = await import('~/server/database')
      
      // Rechercher les maux qui contiennent le terme de recherche
      const mauxTrouves = await Maux.findAll({
        where: {
          Symptom: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        attributes: ['id', 'Symptom'],
        order: [
          // Prioriser les résultats qui commencent par le terme recherché
          [Maux.sequelize!.literal(`CASE WHEN Symptom LIKE '${searchTerm}%' THEN 0 ELSE 1 END`), 'ASC'],
          ['Symptom', 'ASC']
        ],
        limit: 10, // Limiter à 10 suggestions max
        raw: true
      }) as any[]

      console.log('✅ [SUGGESTIONS] Maux trouvés:', mauxTrouves.length)

      const suggestions = mauxTrouves.map(mal => ({
        id: mal.id,
        symptom: mal.Symptom,
        // Mettre en évidence le terme recherché
        highlighted: mal.Symptom.replace(
          new RegExp(`(${searchTerm})`, 'gi'),
          '<mark>$1</mark>'
        )
      }))

      return {
        success: true,
        suggestions,
        count: suggestions.length,
        searchTerm,
        message: `${suggestions.length} suggestion(s) trouvée(s)`
      }

    } catch (dbError: any) {
      console.error('❌ [SUGGESTIONS] Erreur base de données:', dbError.message)
      throw createError({
        statusCode: 503,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('❌ [SUGGESTIONS] Erreur générale:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la recherche de suggestions'
    })
  }
}) 