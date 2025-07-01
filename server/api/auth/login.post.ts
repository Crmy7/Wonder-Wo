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
        message: 'Connexion réussie !'
      }

    } catch (dbError: any) {
      // Si c'est une erreur d'authentification (401), la remonter directement
      if (dbError.statusCode === 401) {
        throw dbError
      }
      
      // Sinon, c'est une vraie erreur de base de données, utiliser le fallback
      console.log('Erreur base de données, utilisation du système mémoire:', dbError.message)
      
      try {
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
          message: 'Connexion réussie (système de secours) !'
        }
      } catch (fallbackError: any) {
        // Si même le fallback échoue, remonter l'erreur
        if (fallbackError.statusCode === 401) {
          throw fallbackError
        }
        
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur système lors de la connexion'
        })
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