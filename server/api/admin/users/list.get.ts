import { requireAdmin } from '~/server/utils/auth-middleware'
import { Op } from 'sequelize'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier les droits admin
    await requireAdmin(event)

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const search = query.search as string || ''
    
    try {
      const { User } = await import('~/server/database')
      
      // Configuration de la pagination
      const offset = (page - 1) * limit
      
      // Configuration de la recherche
      const whereClause = search ? {
        email: {
          [Op.like]: `%${search}%`
        }
      } : {}
      
      // Récupérer les utilisateurs avec pagination
      const { rows: users, count: total } = await User.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt']
      })

      return {
        success: true,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour la liste des utilisateurs')
      
      // Fallback avec données de démonstration
      const mockUsers = [
        {
          id: 1,
          email: 'admin@wonderwo.com',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'user@wonderwo.com',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      return {
        success: true,
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 20,
          total: mockUsers.length,
          totalPages: 1
        },
        message: 'Mode développement - données de démonstration'
      }
    }

  } catch (error: any) {
    console.error('Erreur liste utilisateurs admin:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des utilisateurs'
    })
  }
}) 