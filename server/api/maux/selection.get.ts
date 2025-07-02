export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [MAUX-SELECTION] Récupération des maux populaires pour sélection')
    
    try {
      const { Maux, Recettes, sequelize } = await import('~/server/database')
      const { Op } = await import('sequelize')
      
      // Récupérer les maux qui ont des recettes associées
      // Utilisation d'une sous-requête pour éviter les problèmes de GROUP BY avec MySQL
      const mauxAvecRecettes = await Maux.findAll({
        where: {
          id: {
            [Op.in]: sequelize.literal(`(
              SELECT DISTINCT rm.MauxId 
              FROM RecetteMaux rm 
              INNER JOIN Recettes r ON rm.RecetteId = r.id
            )`)
          }
        },
        attributes: ['id', 'Symptom'],
        order: [
          // Prioriser certains maux courants
          [Maux.sequelize!.literal(`CASE 
            WHEN LOWER(Symptom) LIKE '%stress%' THEN 1
            WHEN LOWER(Symptom) LIKE '%sommeil%' THEN 2
            WHEN LOWER(Symptom) LIKE '%anxiété%' THEN 3
            WHEN LOWER(Symptom) LIKE '%insomnie%' THEN 4
            WHEN LOWER(Symptom) LIKE '%fatigue%' THEN 5
            WHEN LOWER(Symptom) LIKE '%mal de tête%' THEN 6
            WHEN LOWER(Symptom) LIKE '%digestion%' OR LOWER(Symptom) LIKE '%crampes%' THEN 7
            WHEN LOWER(Symptom) LIKE '%nausées%' OR LOWER(Symptom) LIKE '%vomissement%' THEN 8
            WHEN LOWER(Symptom) LIKE '%rhume%' OR LOWER(Symptom) LIKE '%toux%' THEN 9
            WHEN LOWER(Symptom) LIKE '%douleur%' THEN 10
            ELSE 99
          END`), 'ASC'],
          ['Symptom', 'ASC']
        ],
        limit: 15, // Limiter pour éviter une liste trop longue
        raw: true
      }) as any[]
      
      console.log('✅ [MAUX-SELECTION] Maux avec recettes trouvés:', mauxAvecRecettes.length)
      
      // Formater pour l'interface
      const mauxFormates = mauxAvecRecettes.map(mal => ({
        id: mal.id,
        symptom: mal.Symptom,
        // Ajouter des icônes selon le type de mal
        icon: getIconeForSymptom(mal.Symptom),
        category: getCategoryForSymptom(mal.Symptom)
      }))
      
      return {
        success: true,
        maux: mauxFormates,
        count: mauxFormates.length,
        message: `${mauxFormates.length} mal(aux) disponible(s) pour sélection`
      }
      
    } catch (dbError: any) {
      console.error('❌ [MAUX-SELECTION] Erreur base de données:', dbError.message)
      
      // Fallback avec maux prédéfinis si la DB n'est pas disponible
      const mauxFallback = [
        { id: 999, symptom: 'Stress', icon: '😰', category: 'Mental' },
        { id: 998, symptom: 'Insomnie', icon: '😴', category: 'Sommeil' },
        { id: 997, symptom: 'Anxiété', icon: '😟', category: 'Mental' },
        { id: 996, symptom: 'Fatigue', icon: '😪', category: 'Énergie' },
        { id: 995, symptom: 'Mal de tête', icon: '🤕', category: 'Douleur' },
        { id: 994, symptom: 'Digestion difficile', icon: '🤢', category: 'Digestif' },
        { id: 993, symptom: 'Rhume', icon: '🤧', category: 'Respiratoire' },
        { id: 992, symptom: 'Douleurs musculaires', icon: '💪', category: 'Douleur' }
      ]
      
      return {
        success: true,
        maux: mauxFallback,
        count: mauxFallback.length,
        message: 'Liste de maux par défaut (base de données non disponible)',
        fallback: true
      }
    }
    
  } catch (error: any) {
    console.error('❌ [MAUX-SELECTION] Erreur générale:', error.message)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des maux'
    })
  }
})

// Fonctions utilitaires
function getIconeForSymptom(symptom: string): string {
  const symptomLower = symptom.toLowerCase()
  
  if (symptomLower.includes('stress')) return '😰'
  if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return '😴'
  if (symptomLower.includes('anxiété') || symptomLower.includes('angoisse')) return '😟'
  if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement')) return '😪'
  if (symptomLower.includes('mal de tête') || symptomLower.includes('migraine')) return '🤕'
  if (symptomLower.includes('digestion') || symptomLower.includes('crampes') || symptomLower.includes('ballonnements')) return '🤢'
  if (symptomLower.includes('rhume') || symptomLower.includes('toux') || symptomLower.includes('grippe')) return '🤧'
  if (symptomLower.includes('douleur') || symptomLower.includes('mal')) return '💊'
  if (symptomLower.includes('nausées') || symptomLower.includes('vomissement')) return '🤮'
  if (symptomLower.includes('fièvre')) return '🤒'
  if (symptomLower.includes('allergie') || symptomLower.includes('urticaire')) return '🤧'
  
  return '🌿' // Icône par défaut
}

function getCategoryForSymptom(symptom: string): string {
  const symptomLower = symptom.toLowerCase()
  
  if (symptomLower.includes('stress') || symptomLower.includes('anxiété') || symptomLower.includes('angoisse')) return 'Mental'
  if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return 'Sommeil'
  if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement') || symptomLower.includes('énergie')) return 'Énergie'
  if (symptomLower.includes('digestion') || symptomLower.includes('crampes') || symptomLower.includes('ballonnements') || symptomLower.includes('nausées')) return 'Digestif'
  if (symptomLower.includes('rhume') || symptomLower.includes('toux') || symptomLower.includes('grippe') || symptomLower.includes('allergie')) return 'Respiratoire'
  if (symptomLower.includes('douleur') || symptomLower.includes('mal de tête') || symptomLower.includes('migraine')) return 'Douleur'
  if (symptomLower.includes('peau') || symptomLower.includes('urticaire') || symptomLower.includes('eczéma')) return 'Peau'
  
  return 'Général'
} 