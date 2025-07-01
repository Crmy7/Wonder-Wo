import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const userId = await getCurrentUser(event)
    
    const body = await readBody(event)
    const { nom, age, grossesse, enfants } = body

    // Validation des données
    if (!nom || !age) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nom et âge requis'
      })
    }

    if (age < 0 || age > 120) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Âge doit être entre 0 et 120 ans'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { Profil } = await import('~/server/database')
      
      // Créer le profil en base
      const profil: any = await Profil.create({
        userId,
        nom,
        age: parseInt(age),
        grossesse: grossesse || false,
        enfants: enfants || false
      })

      return {
        success: true,
        profil: {
          id: profil.id,
          nom: profil.nom,
          age: profil.age,
          grossesse: profil.grossesse,
          enfants: profil.enfants
        },
        message: 'Profil créé avec succès'
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour profils')
      throw createError({
        statusCode: 500,
        statusMessage: 'Base de données non disponible'
      })
    }

  } catch (error: any) {
    console.error('Erreur création profil:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la création du profil'
    })
  }
}) 