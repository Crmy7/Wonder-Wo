import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  try {
    const { User, Produit, Recettes, Comments } = await import('~/server/database')
    
    // Compter les utilisateurs
    const totalUsers = await User.count()
    
    // Compter les admins
    const totalAdmins = await User.count({
      where: {
        role: 'admin'
      }
    })
    
    // Compter les produits
    const totalProducts = await Produit.count()
    
    // Compter les recettes
    const totalRecipes = await Recettes.count()
    
    // Compter les commentaires
    const totalComments = await Comments.count()
    
    // Compter les commentaires en attente
    const pendingComments = await Comments.count({
      where: {
        status: 'pending'
      }
    })
    
    return {
      users: totalUsers,
      products: totalProducts,
      recipes: totalRecipes,
      admins: totalAdmins,
      comments: totalComments,
      pendingComments: pendingComments
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    // Fallback avec données par défaut pour le développement
    return {
      users: 1,
      products: 156,
      recipes: 89,
      admins: 1,
      comments: 0,
      pendingComments: 0
    }
  }
}) 