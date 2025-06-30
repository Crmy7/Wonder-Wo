export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Test de connexion à la base de données...')
    
    // Vérifier les variables d'environnement
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wonder_wo'
    }
    
    console.log('📋 Configuration DB:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? '***' : 'EMPTY'
    })
    
    // Test de connexion Sequelize
    const { sequelize } = await import('~/server/database')
    
    // Tenter la connexion
    await sequelize.authenticate()
    console.log('✅ Connexion MySQL réussie')
    
    // Vérifier les tables existantes
    const queryInterface = sequelize.getQueryInterface()
    const tables = await queryInterface.showAllTables()
    console.log('📊 Tables existantes:', tables)
    
    // Tester la synchronisation
    console.log('🔄 Test de synchronisation...')
    await sequelize.sync({ force: false })
    console.log('✅ Synchronisation réussie')
    
    // Vérifier à nouveau les tables
    const tablesAfter = await queryInterface.showAllTables()
    console.log('📊 Tables après sync:', tablesAfter)
    
    return {
      success: true,
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
      },
      tablesExistantes: tables,
      tablesApresSync: tablesAfter,
      message: 'Test de connexion réussi'
    }
    
  } catch (error: any) {
    console.error('❌ Erreur test DB:', error.message)
    console.error('📋 Détails erreur:', error)
    
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'wonder_wo'
      }
    }
  }
}) 