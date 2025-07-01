import { verifyPassword, generateToken, findUserByEmail } from '~/server/utils/simple-auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validation des données
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { User } = await import('~/server/database')
      
      // Trouver l'utilisateur
      const user: any = await User.findOne({ where: { email } })
      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Email ou mot de passe incorrect'
        })
      }

      // Vérifier le mot de passe
      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Email ou mot de passe incorrect'
        })
      }

      // Générer le token JWT
      const token = generateToken(user.id)

      setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email
        },
        message: 'Connexion réussie avec base de données MySQL'
      }

    } catch (dbError) {
      // Fallback vers le système simple si MySQL pas dispo
      console.log('MySQL non disponible, utilisation du système mémoire')
      
      const user = await findUserByEmail(email)
      if (!user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Email ou mot de passe incorrect'
        })
      }

      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Email ou mot de passe incorrect'
        })
      }

      const token = generateToken(user.id)

      setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email
        },
        message: 'Connexion réussie (mode développement sans MySQL)'
      }
    }

  } catch (error: any) {
    console.error('Erreur connexion:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la connexion'
    })
  }
}) 