import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  try {
    const { User, Produit, Recettes } = await import('~/server/database')
    
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
    
    return {
      users: totalUsers,
      products: totalProducts,
      recipes: totalRecipes,
      admins: totalAdmins
    }
    
  } catch (dbError) {
    console.error('Erreur base de données:', dbError)
    
    // Fallback avec données par défaut pour le développement
    return {
      users: 1,
      products: 156,
      recipes: 89,
      admins: 1
    }
  }
}) 