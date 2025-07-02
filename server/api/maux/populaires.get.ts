export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [POPULAIRES] Récupération des maux populaires avec recettes')
    
    const { Maux, Recettes } = await import('~/server/database')
    
    // Approche alternative : récupérer d'abord tous les maux puis filtrer ceux avec recettes
    console.log('🔍 [POPULAIRES] Étape 1: Récupération de tous les maux')
    const tousMaux = await Maux.findAll({
      attributes: ['id', 'Symptom'],
      order: [['id', 'ASC']],
      raw: true
    }) as any[]
    
    console.log('📊 [POPULAIRES] Total maux trouvés:', tousMaux.length)
    
    // Vérifier pour chaque mal s'il a des recettes
    console.log('🔍 [POPULAIRES] Étape 2: Vérification des recettes associées')
    const mauxAvecRecettes = []
    
    for (const mal of tousMaux.slice(0, 20)) { // Limiter la vérification aux 20 premiers
      try {
        const recettesCount = await Recettes.count({
          include: [
            {
              model: Maux,
              as: 'maux',
              where: { id: mal.id },
              through: { attributes: [] }
            }
          ]
        })
        
        if (recettesCount > 0) {
          console.log(`✅ [POPULAIRES] Mal "${mal.Symptom}" a ${recettesCount} recette(s)`)
          mauxAvecRecettes.push(mal)
        } else {
          console.log(`⚪ [POPULAIRES] Mal "${mal.Symptom}" n'a pas de recettes`)
        }
        
        // Arrêter quand on a 12 maux avec recettes
        if (mauxAvecRecettes.length >= 12) {
          break
        }
      } catch (err: any) {
        console.warn(`⚠️ [POPULAIRES] Erreur vérification recettes pour "${mal.Symptom}":`, err.message)
      }
    }
    
    const mauxPopulaires = mauxAvecRecettes
    
    console.log('✅ [POPULAIRES] Maux avec recettes trouvés:', mauxPopulaires.length)
    
    // Extraire seulement les symptômes
    const symptomes = mauxPopulaires.map(mal => mal.Symptom)
    
    console.log('📝 [POPULAIRES] Premiers symptômes:', symptomes.slice(0, 5))
    
    // Si pas de maux avec recettes en base, retourner des exemples par défaut
    const symptomesDefaut = [
      'mal de tête',
      'stress',
      'insomnie',
      'rhume',
      'digestion difficile',
      'fatigue',
      'anxiété',
      'mal de gorge',
      'douleurs musculaires',
      'brûlures d\'estomac'
    ]
    
    const result = symptomes.length > 0 ? symptomes : symptomesDefaut
    
    const response = {
      success: true,
      symptomes: result,
      count: result.length,
      fromDatabase: symptomes.length > 0
    }
    
    console.log('🎉 [POPULAIRES] Réponse finale:', {
      count: response.count,
      fromDatabase: response.fromDatabase,
      premiers: response.symptomes.slice(0, 3)
    })
    
    return response
    
  } catch (error: any) {
    console.error('❌ [POPULAIRES] Erreur:', error.message)
    
    // En cas d'erreur, retourner des exemples par défaut
    const symptomesDefaut = [
      'mal de tête',
      'stress',
      'insomnie',
      'rhume',
      'digestion difficile',
      'fatigue',
      'anxiété',
      'mal de gorge',
      'douleurs musculaires',
      'brûlures d\'estomac'
    ]
    
    return {
      success: true,
      symptomes: symptomesDefaut,
      count: symptomesDefaut.length,
      fromDatabase: false,
      error: 'Base de données non disponible, utilisation des exemples par défaut'
    }
  }
}) 