import { requireAdmin } from '~/server/utils/auth-middleware'

export default defineEventHandler(async (event) => {
  // Vérifier les droits admin
  await requireAdmin(event)
  
  console.log('🌱 [SEED] Insertion de recettes de test')
  
  try {
    const { Recettes, Produit, Maux, sequelize } = await import('~/server/database')
    
    // Vérifier s'il y a déjà des recettes
    const existingCount = await Recettes.count()
    
    if (existingCount > 0) {
      return {
        success: true,
        message: `Base déjà peuplée avec ${existingCount} recettes`,
        inserted: 0
      }
    }
    
    // Créer quelques recettes de test
    const testRecipes = [
      {
        Type_Remede: 1,
        Type_Application: 1,
        Recette: "Infusion relaxante de camomille: Faire infuser 2 cuillères à café de fleurs de camomille dans 250ml d'eau chaude pendant 10 minutes. Boire avant le coucher.",
        Tranche_age: 4,
        Femme_Enceinte: true,
        Source_Documentaire: "Phytothérapie traditionnelle",
        Efficacite: 4
      },
      {
        Type_Remede: 2,
        Type_Application: 2,
        Recette: "Décoction anti-inflammatoire de curcuma: Faire bouillir 1 cuillère à café de curcuma en poudre dans 500ml d'eau pendant 15 minutes. Appliquer en compresse tiède.",
        Tranche_age: 4,
        Femme_Enceinte: false,
        Source_Documentaire: "Médecine ayurvédique",
        Efficacite: 5
      },
      {
        Type_Remede: 4,
        Type_Application: 3,
        Recette: "Diffusion d'huiles essentielles pour le stress: Mélanger 3 gouttes de lavande vraie et 2 gouttes d'orange douce dans un diffuseur. Diffuser 20 minutes.",
        Tranche_age: 4,
        Femme_Enceinte: false,
        Source_Documentaire: "Aromathérapie scientifique",
        Efficacite: 4
      },
      {
        Type_Remede: 1,
        Type_Application: 1,
        Recette: "Tisane digestive après repas: Mélanger à parts égales menthe poivrée, fenouil et gingembre. Infuser 1 cuillère à soupe du mélange dans 250ml d'eau chaude.",
        Tranche_age: 4,
        Femme_Enceinte: true,
        Source_Documentaire: "Herboristerie moderne",
        Efficacite: 3
      },
      {
        Type_Remede: 3,
        Type_Application: 2,
        Recette: "Cataplasme d'argile verte pour les inflammations: Mélanger argile verte avec de l'eau jusqu'à obtenir une pâte. Appliquer sur la zone pendant 30 minutes.",
        Tranche_age: 4,
        Femme_Enceinte: true,
        Source_Documentaire: "Géothérapie traditionnelle",
        Efficacite: 4
      }
    ]
    
    // Insérer les recettes
    const insertedRecipes = await Recettes.bulkCreate(testRecipes)
    
    console.log('✅ [SEED] Recettes insérées:', insertedRecipes.length)
    
    // Vérifier quelques produits et maux pour les relations
    const produitCount = await Produit.count()
    const mauxCount = await Maux.count()
    
    console.log('📊 [SEED] Produits disponibles:', produitCount)
    console.log('📊 [SEED] Maux disponibles:', mauxCount)
    
    // Créer quelques relations de test si des produits/maux existent
    if (produitCount > 0 && insertedRecipes.length > 0) {
      try {
        const premiers3Produits = await Produit.findAll({ limit: 3 })
        const premiere_recette = insertedRecipes[0]
        
        // Associer les 3 premiers produits à la première recette
        await premiere_recette.setProduits(premiers3Produits)
        console.log('🔗 [SEED] Relations produits créées')
      } catch (relationError) {
        console.error('⚠️ [SEED] Erreur création relations produits:', relationError.message)
      }
    }
    
    if (mauxCount > 0 && insertedRecipes.length > 0) {
      try {
        const premiers3Maux = await Maux.findAll({ limit: 3 })
        const premiere_recette = insertedRecipes[0]
        
        // Associer les 3 premiers maux à la première recette
        await premiere_recette.setMaux(premiers3Maux)
        console.log('🔗 [SEED] Relations maux créées')
      } catch (relationError) {
        console.error('⚠️ [SEED] Erreur création relations maux:', relationError.message)
      }
    }
    
    return {
      success: true,
      message: 'Recettes de test insérées avec succès',
      inserted: insertedRecipes.length,
      relations_created: produitCount > 0 && mauxCount > 0,
      stats: {
        total_recipes: await Recettes.count(),
        total_products: produitCount,
        total_maux: mauxCount
      }
    }
    
  } catch (error: any) {
    console.error('❌ [SEED] Erreur insertion:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de l'insertion: ${error.message}`
    })
  }
}) 