import { getCurrentUser } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)

    // Essayer la base de données d'abord
    try {
      const { Placard, Produit } = await import('~/server/database')
      
      // Récupérer tous les produits du placard de l'utilisateur avec les détails des produits
      const placardItems = await Placard.findAll({
        where: { IdUser },
        include: [{
          model: Produit,
          as: 'produits',
          attributes: [
            'id', 'Nom_Commun', 'Nom_Scientifique', 'Famille_Botanique',
            'Partie_Plante', 'Composition', 'Forme_Galenique',
            'Propriete_Principale', 'Propriete_Secondaire', 'Utilisation',
            'Precautions', 'Source', 'Image_url'
          ]
        }],
        order: [['createdAt', 'DESC']]
      })

      return {
        success: true,
        items: placardItems.map((item: any) => ({
          id: item.id,
          produit: item.produit,
          IdProduit: item.IdProduit,
          createdAt: item.createdAt,
          details: item.produits ? {
            id: item.produits.id,
            nom: item.produits.Nom_Commun,
            nomScientifique: item.produits.Nom_Scientifique,
            famille: item.produits.Famille_Botanique,
            partie: item.produits.Partie_Plante,
            composition: item.produits.Composition,
            formeGalenique: item.produits.Forme_Galenique,
            proprietesPrincipales: item.produits.Propriete_Principale,
            proprietesSecondaires: item.produits.Propriete_Secondaire,
            utilisation: item.produits.Utilisation,
            precautions: item.produits.Precautions,
            source: item.produits.Source,
            imageUrl: item.produits.Image_url,
            slug: item.produits.Nom_Commun.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
          } : null
        })),
        count: placardItems.length
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour placard')
      return {
        success: true,
        items: [],
        count: 0,
        message: 'Base de données non disponible - mode développement'
      }
    }

  } catch (error: any) {
    console.error('Erreur récupération placard:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération du placard'
    })
  }
})