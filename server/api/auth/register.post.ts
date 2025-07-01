import { hashPassword, generateToken, createUser, findUserByEmail } from '~/server/utils/simple-auth'

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

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins 6 caractères'
      })
    }

    // Essayer la base de données d'abord
    try {
      const { User } = await import('~/server/database')
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Un utilisateur avec cet email existe déjà'
        })
      }

      // Créer l'utilisateur en base
      const hashedPassword = await hashPassword(password)
      const user: any = await User.create({
        email,
        password: hashedPassword
      })

      // Générer le token JWT
      const token = generateToken(user.id)

      // Définir le cookie sécurisé
      setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email
        },
        message: 'Inscription réussie !'
      }

    } catch (dbError: any) {
      // Si c'est une erreur de validation (400, 409), la remonter directement
      if (dbError.statusCode === 400 || dbError.statusCode === 409) {
        throw dbError
      }
      
      // Sinon, c'est une vraie erreur de base de données, utiliser le fallback
      console.log('Erreur base de données, utilisation du système mémoire:', dbError.message)
      
      try {
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
          throw createError({
            statusCode: 409,
            statusMessage: 'Un utilisateur avec cet email existe déjà'
          })
        }

        const user = await createUser(email, password)
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
          message: 'Inscription réussie (système de secours) !'
        }
      } catch (fallbackError: any) {
        // Si même le fallback échoue, remonter l'erreur
        if (fallbackError.statusCode === 400 || fallbackError.statusCode === 409) {
          throw fallbackError
        }
        
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur système lors de l\'inscription'
        })
      }
    }

  } catch (error: any) {
    console.error('Erreur inscription:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de l\'inscription'
    })
  }
}) 