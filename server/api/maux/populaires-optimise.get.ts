export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [POPULAIRES-OPT] Récupération optimisée des maux avec recettes')
    
    const { sequelize } = await import('~/server/database')
    
    // Requête SQL directe pour obtenir les maux ayant des recettes
    const [results] = await sequelize.query(`
      SELECT DISTINCT m.id, m.Symptom 
      FROM Maux m
      INNER JOIN RecetteMaux rm ON m.id = rm.MauxId
      INNER JOIN Recettes r ON rm.RecetteId = r.id
      ORDER BY m.id ASC
      LIMIT 12
    `)
    
    console.log('✅ [POPULAIRES-OPT] Maux avec recettes trouvés:', results.length)
    
    // Extraire les symptômes
    const symptomes = (results as any[]).map(mal => mal.Symptom)
    
    console.log('📝 [POPULAIRES-OPT] Symptômes récupérés:', symptomes.slice(0, 5))
    
    // Fallback si aucun résultat
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
    
    return {
      success: true,
      symptomes: result,
      count: result.length,
      fromDatabase: symptomes.length > 0,
      method: 'sql-direct'
    }
    
  } catch (error: any) {
    console.error('❌ [POPULAIRES-OPT] Erreur:', error.message)
    
    // Fallback en cas d'erreur
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
      error: 'Base de données non disponible, utilisation des exemples par défaut',
      method: 'fallback'
    }
  }
}) 