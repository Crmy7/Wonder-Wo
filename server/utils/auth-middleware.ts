import { verifyToken } from './simple-auth'

export const getCurrentUser = async (event: any) => {
  try {
    // Récupérer le token depuis les cookies
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification manquant'
      })
    }

    // Vérifier le token
    const decoded = verifyToken(token)
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification invalide'
      })
    }

    return decoded.userId
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentification requise'
    })
  }
} 