export default defineEventHandler(async (event) => {
  try {
    // Supprimer le cookie d'authentification
    deleteCookie(event, 'auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return {
      success: true,
      message: 'Déconnexion réussie'
    }
  } catch (error: any) {
    console.error('Erreur déconnexion:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la déconnexion'
    })
  }
}) 