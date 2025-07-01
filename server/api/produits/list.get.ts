export default defineEventHandler(async (event) => {
  try {
    // Essayer la base de données d'abord
    try {
      const { Produit } = await import('~/server/database')
      
      // Récupérer tous les produits
      const produits = await Produit.findAll({
        order: [['Nom_Commun', 'ASC']]
      })

      return {
        success: true,
        produits: produits.map((produit: any) => ({
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
          slug: produit.Nom_Commun.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        })),
        count: produits.length
      }

    } catch (dbError) {
      console.log('MySQL non disponible pour produits - utilisation de données fictives')
      
      // Données fictives en cas d'absence de base de données
      const produitsFictifs = [
        {
          id: 1,
          nom: 'Lavande',
          nomScientifique: 'Lavandula angustifolia',
          famille: 'Lamiacées',
          partie: 'Fleurs',
          composition: 'Huiles essentielles (linalol, acétate de linalyle), tanins, flavonoïdes',
          formeGalenique: 1,
          proprietesPrincipales: 'Relaxante, sédative',
          proprietesSecondaires: 'Antiseptique, cicatrisante',
          utilisation: 'Infusion, huile essentielle, sachets parfumés',
          precautions: 'Éviter chez les enfants de moins de 3 ans. L\'huile essentielle est déconseillée chez la femme enceinte.',
          source: 'Pharmacopée européenne',
          imageUrl: '🌿',
          slug: 'lavande'
        },
        {
          id: 2,
          nom: 'Miel de Manuka',
          nomScientifique: 'Leptospermum scoparium',
          famille: 'Myrtacées',
          partie: 'Nectar des fleurs',
          composition: 'Méthylglyoxal (MGO), enzymes, oligoéléments',
          formeGalenique: 2,
          proprietesPrincipales: 'Antibactérien, cicatrisant',
          proprietesSecondaires: 'Anti-inflammatoire, immunostimulant',
          utilisation: 'Consommation directe, gargarisme, application locale',
          precautions: 'Ne pas donner aux enfants de moins de 1 an. Attention en cas de diabète.',
          source: 'Standards UMF',
          imageUrl: '🍯',
          slug: 'miel-de-manuka'
        },
        {
          id: 3,
          nom: 'Camomille',
          nomScientifique: 'Matricaria chamomilla',
          famille: 'Astéracées',
          partie: 'Capitules floraux',
          composition: 'Chamazulène, bisabolol, flavonoïdes, mucilages',
          formeGalenique: 1,
          proprietesPrincipales: 'Digestive, anti-inflammatoire',
          proprietesSecondaires: 'Calmante, antispasmodique',
          utilisation: 'Tisane, compresse, bain de siège',
          precautions: 'Éviter en cas d\'allergie aux Astéracées. Possible interaction avec anticoagulants.',
          source: 'Pharmacopée française',
          imageUrl: '🫖',
          slug: 'camomille'
        }
      ]

      return {
        success: true,
        produits: produitsFictifs,
        count: produitsFictifs.length,
        message: 'Base de données non disponible - données fictives'
      }
    }

  } catch (error: any) {
    console.error('Erreur récupération produits:', error.message)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la récupération des produits'
    })
  }
})