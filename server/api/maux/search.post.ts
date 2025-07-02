// server/api/maux/search.post.ts
import { getCurrentUser } from '~/server/utils/auth-middleware'
import { Op } from 'sequelize'

// Types pour les résultats
interface ProduitRecette {
  id: number
  nom: string
  nomScientifique: string
  dansPlacard: boolean
  imageUrl: string
  proprietes: string
}

interface ResultatRecherche {
  id: string
  type: 'recette' | 'produit_simple'
  nomRecette: string
  description: string
  typeApplication: string
  produits: ProduitRecette[]
  produitsPlacardDisponibles: number
  sourceDocumentaire: string
  adapteAuProfil: boolean
  raisonNonAdapte: string | null
  score: number
  categorie: string
  imageUrl: string
  efficacite: number
}

interface ProfilUtilisateur {
  age?: number
  grossesse?: boolean
  enfants?: boolean
}

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const IdUser = await getCurrentUser(event)
    
    const body = await readBody(event)
    const { symptome, profil }: { symptome: string, profil?: ProfilUtilisateur } = body

    // Validation des données
    if (!symptome || !symptome.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Symptôme requis pour la recherche'
      })
    }

    // Essayer la base de données d'abord
    try {
      console.log('🔍 [ETAPE 1] Début recherche pour symptôme:', symptome, 'utilisateur:', IdUser)
      
      const { Maux, Produit, Recettes, Placard } = await import('~/server/database')
      console.log('✅ [ETAPE 1] Import des modèles réussi')
      
      // 1. Récupérer les produits du placard de l'utilisateur
      console.log('🔍 [ETAPE 2] Récupération du placard pour utilisateur:', IdUser)
      const placardUtilisateur = await Placard.findAll({
        where: { IdUser },
        raw: true
      }) as any[]
      
      const produitsPlacardIds: number[] = placardUtilisateur.map((item: any) => item.IdProduit)
      console.log('✅ [ETAPE 2] Produits dans le placard:', produitsPlacardIds.length, 'produits ->', produitsPlacardIds)

      // 2. Recherche dans les maux correspondant au symptôme
      console.log('🔍 [ETAPE 3] Recherche dans les maux avec symptôme:', symptome)
      const mauxTrouves = await Maux.findAll({
        where: {
          Symptom: {
            [Op.like]: `%${symptome}%`
          }
        },
        raw: true
      }) as any[]

      console.log('✅ [ETAPE 3] Maux trouvés:', mauxTrouves.length, 'résultats')
      if (mauxTrouves.length > 0) {
        console.log('📝 [ETAPE 3] Premiers maux:', mauxTrouves.slice(0, 3).map(m => m.Symptom))
      }

      // 3. Recherche directe dans les produits par propriétés
      console.log('🔍 [ETAPE 4] Recherche dans les produits avec symptôme:', symptome)
      const produitsRecommandes = await Produit.findAll({
        where: {
          [Op.or]: [
            {
              Propriete_Principale: {
                [Op.like]: `%${symptome}%`
              }
            },
            {
              Propriete_Secondaire: {
                [Op.like]: `%${symptome}%`
              }
            },
            {
              Utilisation: {
                [Op.like]: `%${symptome}%`
              }
            }
          ]
        },
        attributes: [
          'id', 'Nom_Commun', 'Nom_Scientifique', 
          'Propriete_Principale', 'Propriete_Secondaire',
          'Utilisation', 'Precautions', 'Image_url'
        ],
        raw: true
      }) as any[]

      console.log('✅ [ETAPE 4] Produits trouvés:', produitsRecommandes.length, 'résultats')
      if (produitsRecommandes.length > 0) {
        console.log('📝 [ETAPE 4] Premiers produits:', produitsRecommandes.slice(0, 3).map(p => p.Nom_Commun))
      }

      // 4. Formater et prioriser les résultats
      console.log('🔍 [ETAPE 5] Formatage des résultats')
      const resultats: ResultatRecherche[] = []

      // Fonction pour vérifier l'adaptation au profil
      const estAdapteAuProfil = (recette?: any): boolean => {
        if (!profil || !recette) return true
        
        // Vérifier grossesse
        if (profil.grossesse && recette.Femme_Enceinte === false) {
          return false
        }
        
        // Vérifier tranche d'âge (codes: 1=enfant, 2=adulte, 3=senior)
        if (profil.age && recette.Tranche_age) {
          if (profil.age < 12 && recette.Tranche_age > 1) return false
          if (profil.age > 65 && recette.Tranche_age === 1) return false
        }
        
        return true
      }

      // Fonction pour calculer le score de priorité
      const calculerScore = (produitIds: number[], hasRecette: boolean = false): number => {
        let score = 0.5 // Score de base
        
        // Boost si produits du placard disponibles
        const produitsPlacardDansRecette = produitIds.filter(id => 
          produitsPlacardIds.includes(id)
        )
        
        if (produitsPlacardDansRecette.length > 0) {
          score += 0.4 + (produitsPlacardDansRecette.length * 0.1)
        }
        
        // Boost pour les recettes vs produits simples
        if (hasRecette) {
          score += 0.2
        }
        
        return Math.min(score, 1.0) // Cap à 1.0
      }

      // 5. Traiter les produits trouvés directement
      console.log('🔍 [ETAPE 6] Traitement des produits trouvés:', produitsRecommandes.length)
      for (const produit of produitsRecommandes) {
        const dansPlacard = produitsPlacardIds.includes(produit.id)
        const score = calculerScore([produit.id], false)
        console.log(`📝 [ETAPE 6] Produit: ${produit.Nom_Commun}, dans placard: ${dansPlacard}, score: ${score}`)
        
        // Ajouter le produit comme remède simple
        const resultatProduit: ResultatRecherche = {
          id: `produit-${produit.id}`,
          type: 'produit_simple',
          nomRecette: `Usage de ${produit.Nom_Commun}`,
          description: produit.Utilisation || `Remède naturel à base de ${produit.Nom_Commun}`,
          typeApplication: 'Usage direct',
          produits: [{
            id: produit.id,
            nom: produit.Nom_Commun,
            nomScientifique: produit.Nom_Scientifique,
            dansPlacard,
            imageUrl: produit.Image_url || '🌿',
            proprietes: produit.Propriete_Principale || ''
          }],
          produitsPlacardDisponibles: dansPlacard ? 1 : 0,
          sourceDocumentaire: 'Propriétés thérapeutiques',
          adapteAuProfil: true,
          raisonNonAdapte: null,
          score,
          categorie: 'Produit naturel',
          imageUrl: produit.Image_url || '🌿',
          efficacite: 0.7
        }
        resultats.push(resultatProduit)
      }

      // 6. Pour les maux trouvés, chercher des recettes potentielles
      // (Simplification - on pourrait ajouter une logique plus complexe plus tard)
      console.log('🔍 [ETAPE 7] Traitement des maux trouvés:', mauxTrouves.length)
      if (mauxTrouves.length > 0) {
        // Créer un remède générique basé sur le premier mal trouvé
        const premierMal = mauxTrouves[0]
        const produitsLies = produitsRecommandes.slice(0, 3) // Prendre les 3 premiers produits
        console.log(`📝 [ETAPE 7] Premier mal: ${premierMal.Symptom}, produits liés: ${produitsLies.length}`)
        
        if (produitsLies.length > 0) {
          const produitIds = produitsLies.map(p => p.id)
          const score = calculerScore(produitIds, true)
          
          const resultatMal: ResultatRecherche = {
            id: `mal-${premierMal.id}-combinaison`,
            type: 'recette',
            nomRecette: `Remède naturel pour ${premierMal.Symptom}`,
            description: `Combinaison de plantes pour traiter ${premierMal.Symptom}. Utilisation traditionnelle recommandée.`,
            typeApplication: 'Usage interne',
            produits: produitsLies.map((p: any): ProduitRecette => ({
              id: p.id,
              nom: p.Nom_Commun,
              nomScientifique: p.Nom_Scientifique,
              dansPlacard: produitsPlacardIds.includes(p.id),
              imageUrl: p.Image_url || '🌿',
              proprietes: p.Propriete_Principale || ''
            })),
            produitsPlacardDisponibles: produitIds.filter(id => produitsPlacardIds.includes(id)).length,
            sourceDocumentaire: 'Pharmacopée traditionnelle',
            adapteAuProfil: true,
            raisonNonAdapte: null,
            score,
            categorie: 'Recette traditionnelle',
            imageUrl: '🫖',
            efficacite: 0.8
          }
          resultats.push(resultatMal)
        }
      }

      // 7. Éliminer les doublons et trier par score de priorité
      console.log('🔍 [ETAPE 8] Finalisation - résultats bruts:', resultats.length)
      const resultatsUniques = resultats.filter((resultat, index, self) => 
        index === self.findIndex(r => r.id === resultat.id)
      )
      
      console.log('✅ [ETAPE 8] Résultats uniques:', resultatsUniques.length)
      
      resultatsUniques.sort((a, b) => {
        // D'abord par nombre de produits placard disponibles
        if (b.produitsPlacardDisponibles !== a.produitsPlacardDisponibles) {
          return b.produitsPlacardDisponibles - a.produitsPlacardDisponibles
        }
        // Puis par score global
        return b.score - a.score
      })
      
      console.log('✅ [ETAPE 8] Résultats triés par priorité')

      const response = {
        success: true,
        symptome,
        profil,
        resultats: resultatsUniques.slice(0, 15), // Limiter à 15 résultats
        count: resultatsUniques.length,
        placardInfo: {
          totalProduits: produitsPlacardIds.length,
          recettesAvecPlacard: resultatsUniques.filter(r => r.produitsPlacardDisponibles > 0).length,
          recettesSansPlacard: resultatsUniques.filter(r => r.produitsPlacardDisponibles === 0).length
        },
        message: `${resultatsUniques.length} remède(s) trouvé(s) pour "${symptome}"`
      }
      
      console.log('🎉 [ETAPE 9] SUCCÈS - Réponse finale:', {
        symptome: response.symptome,
        count: response.count,
        placardInfo: response.placardInfo
      })
      
      return response

    } catch (dbError: any) {
      console.error('❌ [ERREUR DB] Erreur base de données:', dbError.message)
      console.error('❌ [ERREUR DB] Stack:', dbError.stack)
      throw createError({
        statusCode: 503,
        statusMessage: 'Base de données non disponible. Veuillez vérifier que MySQL est démarré et configuré.'
      })
    }

  } catch (error: any) {
    console.error('❌ [ERREUR GENERALE] Erreur recherche maux:', error.message)
    console.error('❌ [ERREUR GENERALE] Stack:', error.stack)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la recherche de remèdes'
    })
  }
})

// Fonctions utilitaires
function getTypeRemede(code: number): string {
  const types = {
    1: 'Tisane/Infusion',
    2: 'Décoction',
    3: 'Cataplasme',
    4: 'Huile/Baume',
    5: 'Sirop',
    6: 'Teinture',
    7: 'Autre'
  }
  return types[code as keyof typeof types] || 'Remède naturel'
}

function getTypeApplication(code: number): string {
  const types = {
    1: 'Usage interne',
    2: 'Usage externe',
    3: 'Inhalation',
    4: 'Bain',
    5: 'Gargarisme',
    6: 'Autre'
  }
  return types[code as keyof typeof types] || 'Usage spécifique'
}

function getIconeRemede(code: number): string {
  const icones = {
    1: '🫖', // Tisane
    2: '🥃', // Décoction
    3: '🌿', // Cataplasme
    4: '🫒', // Huile
    5: '🍯', // Sirop
    6: '💧', // Teinture
    7: '🌱'  // Autre
  }
  return icones[code as keyof typeof icones] || '🌿'
}

function getRaisonNonAdapte(recette: any, profil: ProfilUtilisateur | undefined): string {
  if (!profil) return ''
  
  const raisons: string[] = []
  
  if (profil.grossesse && !recette.Femme_Enceinte) {
    raisons.push('Non recommandé pendant la grossesse')
  }
  
  if (profil.age && recette.Tranche_age) {
    if (profil.age < 12 && recette.Tranche_age > 1) {
      raisons.push('Non adapté aux enfants')
    }
    if (profil.age > 65 && recette.Tranche_age === 1) {
      raisons.push('Conçu pour les enfants')
    }
  }
  
  return raisons.join(', ')
}