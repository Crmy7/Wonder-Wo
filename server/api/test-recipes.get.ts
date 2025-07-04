export default defineEventHandler(async (event) => {
  console.log('🧪 [TEST] Diagnostic des recettes en base de données')
  
  try {
    const { Recettes, Produit, Maux, sequelize } = await import('~/server/database')
    
    // Test de connexion à la base
    await sequelize.authenticate()
    console.log('✅ [TEST] Connexion DB réussie')
    
    // Compter les recettes
    const recetteCount = await Recettes.count()
    console.log('📊 [TEST] Nombre de recettes:', recetteCount)
    
    // Compter les produits
    const produitCount = await Produit.count()
    console.log('📊 [TEST] Nombre de produits:', produitCount)
    
    // Compter les maux
    const mauxCount = await Maux.count()
    console.log('📊 [TEST] Nombre de maux:', mauxCount)
    
    // Tester une requête simple de recettes
    const simpleRecettes = await Recettes.findAll({
      limit: 5,
      attributes: ['id', 'Type_Remede', 'Recette'],
      raw: true
    })
    console.log('📋 [TEST] Premières recettes (simple):', simpleRecettes)
    
    // Tester une requête avec relations
    let recettesWithRelations = []
    try {
      recettesWithRelations = await Recettes.findAll({
        include: [
          {
            model: Produit,
            as: 'produits',
            attributes: ['id', 'Nom_Commun'],
            through: { attributes: [] }
          },
          {
            model: Maux,
            as: 'maux',
            attributes: ['id', 'Symptom'],
            through: { attributes: [] }
          }
        ],
        limit: 3
      })
      console.log('🔗 [TEST] Recettes avec relations réussies:', recettesWithRelations.length)
    } catch (relationError) {
      console.error('❌ [TEST] Erreur relations:', relationError.message)
    }
    
    // Vérifier les tables de liaison
    try {
      const [recetteProduitResults] = await sequelize.query("SELECT COUNT(*) as count FROM RecetteProduit")
      const [recetteMauxResults] = await sequelize.query("SELECT COUNT(*) as count FROM RecetteMaux")
      
      console.log('🔗 [TEST] Table RecetteProduit:', recetteProduitResults[0]?.count || 0)
      console.log('🔗 [TEST] Table RecetteMaux:', recetteMauxResults[0]?.count || 0)
    } catch (tableError) {
      console.error('❌ [TEST] Erreur tables de liaison:', tableError.message)
    }
    
    return {
      success: true,
      database_connected: true,
      counts: {
        recettes: recetteCount,
        produits: produitCount,
        maux: mauxCount
      },
      sample_recettes: simpleRecettes,
      relations_working: recettesWithRelations.length > 0,
      debug_info: {
        node_env: process.env.NODE_ENV,
        db_host: process.env.DB_HOST ? 'configuré' : 'manquant',
        db_name: process.env.DB_NAME ? 'configuré' : 'manquant'
      }
    }
    
  } catch (error: any) {
    console.error('❌ [TEST] Erreur diagnostic:', error)
    
    return {
      success: false,
      database_connected: false,
      error: error.message,
      error_code: error.code,
      debug_info: {
        node_env: process.env.NODE_ENV,
        db_host: process.env.DB_HOST ? 'configuré' : 'manquant',
        db_name: process.env.DB_NAME ? 'configuré' : 'manquant'
      }
    }
  }
}) 