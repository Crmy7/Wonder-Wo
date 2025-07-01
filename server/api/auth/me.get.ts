import { verifyToken } from '~/server/utils/simple-auth'

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le cookie d'authentification
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié'
      })
    }

    // Vérifier le token JWT
    const decoded = verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    // Essayer de récupérer l'utilisateur depuis la base de données
    try {
      const { User } = await import('~/server/database')
      
      const user: any = await User.findByPk(decoded.userId)
      
      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Utilisateur non trouvé'
        })
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email
        }
      }

    } catch (dbError) {
      // Fallback vers le système simple si MySQL pas dispo
      console.log('MySQL non disponible, utilisation du système mémoire')
      
      // Dans le système simple, on retourne juste les infos du token
      return {
        success: true,
        user: {
          id: decoded.userId,
          email: 'demo@wonderwo.com' // Email par défaut pour le mode démo
        }
      }
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la vérification'
    })
  }
}) 