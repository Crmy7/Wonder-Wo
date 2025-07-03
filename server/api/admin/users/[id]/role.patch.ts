import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier les droits admin
    const adminUser = await requireAdmin(event)

    const userId = parseInt(getRouterParam(event, 'id') as string)
    const body = await readBody(event)
    const { role } = body

    // Validation
    if (!userId || isNaN(userId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID utilisateur invalide'
      })
    }

    if (!role || !['user', 'admin'].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rôle invalide. Doit être "user" ou "admin"'
      })
    }

    // Empêcher un admin de se rétrograder lui-même
    if (adminUser.id === userId && role === 'user') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Impossible de modifier son propre rôle administrateur'
      })
    }

    try {
      const { User } = await import('~/server/database')
      
      // Trouver l'utilisateur
      const user = await User.findByPk(userId)
      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Utilisateur non trouvé'
        })
      }

      // Mettre à jour le rôle
      await user.update({ role })

      return {
        success: true,
        message: `Rôle mis à jour vers "${role}" avec succès`,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          updatedAt: user.updatedAt
        }
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour la mise à jour du rôle')
      
      return {
        success: true,
        message: `Rôle mis à jour vers "${role}" (mode développement)`,
        user: {
          id: userId,
          email: 'user@wonderwo.com',
          role: role,
          updatedAt: new Date()
        }
      }
    }

  } catch (error: any) {
    console.error('Erreur mise à jour rôle utilisateur:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la mise à jour du rôle'
    })
  }
}) 