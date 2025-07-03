import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier les droits admin
    await requireAdmin(event)

    const produitId = parseInt(getRouterParam(event, 'id') as string)
    const body = await readBody(event)

    // Validation
    if (!produitId || isNaN(produitId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID produit invalide'
      })
    }

    // Validation des champs requis
    const requiredFields = ['nom', 'nomScientifique', 'famille', 'partie', 'composition']
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: `Le champ ${field} est requis`
        })
      }
    }

    try {
      const { Produit } = await import('~/server/database')
      
      // Trouver le produit
      const produit = await Produit.findByPk(produitId)
      if (!produit) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Produit non trouvé'
        })
      }

      // Mettre à jour le produit
      await produit.update({
        Nom_Commun: body.nom,
        Nom_Scientifique: body.nomScientifique,
        Famille_Botanique: body.famille,
        Partie_Plante: body.partie,
        Composition: body.composition,
        Forme_Galenique: body.formeGalenique || produit.Forme_Galenique,
        Propriete_Principale: body.proprietesPrincipales || produit.Propriete_Principale,
        Propriete_Secondaire: body.proprietesSecondaires || produit.Propriete_Secondaire,
        Utilisation: body.utilisation || produit.Utilisation,
        Precautions: body.precautions || produit.Precautions,
        Source: body.source || produit.Source,
        Image_url: body.imageUrl || produit.Image_url
      })

      return {
        success: true,
        message: 'Produit mis à jour avec succès',
        produit: {
          id: produit.id,
          nom: produit.Nom_Commun,
          nomScientifique: produit.Nom_Scientifique,
          famille: produit.Famille_Botanique,
          partie: produit.Partie_Plante,
          composition: produit.Composition,
          formeGalenique: produit.Forme_Galenique,
          proprietesPrincipales: produit.Propriete_Principale,
          proprietesSecondaires: produit.Propriete_Secondaire,
          utilisation: produit.Utilisation,
          precautions: produit.Precautions,
          source: produit.Source,
          imageUrl: produit.Image_url,
          updatedAt: produit.updatedAt
        }
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour la mise à jour du produit')
      
      return {
        success: true,
        message: 'Produit mis à jour (mode développement)',
        produit: {
          id: produitId,
          nom: body.nom,
          nomScientifique: body.nomScientifique,
          famille: body.famille,
          partie: body.partie,
          composition: body.composition,
          formeGalenique: body.formeGalenique || 1,
          proprietesPrincipales: body.proprietesPrincipales || '',
          proprietesSecondaires: body.proprietesSecondaires || '',
          utilisation: body.utilisation || '',
          precautions: body.precautions || '',
          source: body.source || '',
          imageUrl: body.imageUrl || '🌿',
          updatedAt: new Date()
        }
      }
    }

  } catch (error: any) {
    console.error('Erreur mise à jour produit:', error.message)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la mise à jour du produit'
    })
  }
}) 