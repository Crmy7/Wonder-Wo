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

      // 5. IGNORER les produits simples - on veut seulement des vraies recettes
      console.log('🔍 [ETAPE 6] Produits trouvés ignorés (on veut seulement des recettes):', produitsRecommandes.length)

      // 6. Pour les maux trouvés, chercher leurs VRAIES recettes via les tables de liaison
      console.log('🔍 [ETAPE 7] Recherche des vraies recettes pour les maux trouvés:', mauxTrouves.length)
      
      for (const mal of mauxTrouves) {
        try {
          console.log(`🔍 [ETAPE 7] Recherche recettes pour mal: "${mal.Symptom}" (ID: ${mal.id})`)
          
          // Trouver les recettes liées à ce mal via la table RecetteMaux
          const recettesLiees = await Recettes.findAll({
            include: [
              {
                model: Maux,
                as: 'maux',
                where: { id: mal.id },
                through: { attributes: [] }
              }
            ],
            attributes: [
              'id', 'Type_Remede', 'Type_Application', 'Recette',
              'Tranche_age', 'Femme_Enceinte', 'Source_Documentaire', 'Efficacite'
            ],
            raw: false // On garde les objets Sequelize pour les relations
          })
          
          console.log(`📝 [ETAPE 7] Recettes trouvées pour "${mal.Symptom}": ${recettesLiees.length}`)
          
          // Log détaillé de chaque recette trouvée
          recettesLiees.forEach((recette, index) => {
            console.log(`📋 [ETAPE 7] Recette ${index + 1}: ID=${(recette as any).id}, Type=${(recette as any).Type_Remede}, Description="${(recette as any).Recette?.substring(0, 50)}..."`)
          })
          
          // Pour chaque recette, trouver ses produits
          for (const recette of recettesLiees) {
            try {
              const produitsRecette = await Produit.findAll({
                include: [
                  {
                    model: Recettes,
                    as: 'recettes',
                    where: { id: (recette as any).id },
                    through: { attributes: [] }
                  }
                ],
                attributes: [
                  'id', 'Nom_Commun', 'Nom_Scientifique', 
                  'Propriete_Principale', 'Image_url'
                ],
                raw: true
              }) as any[]
              
              console.log(`📝 [ETAPE 7] Produits pour recette ${(recette as any).id}: ${produitsRecette.length}`)
              
              // Log des produits trouvés ou manquants
              if (produitsRecette.length > 0) {
                console.log(`📋 [ETAPE 7] Produits de la recette ${(recette as any).id}:`, produitsRecette.map(p => `${p.Nom_Commun} (ID: ${p.id})`))
              } else {
                console.warn(`⚠️ [ETAPE 7] AUCUN PRODUIT trouvé pour recette ${(recette as any).id} - AFFICHÉE QUAND MÊME`)
                console.warn(`⚠️ [ETAPE 7] Détails recette sans produits: Type=${(recette as any).Type_Remede}, Description="${(recette as any).Recette?.substring(0, 100)}..."`)
              }
              
              // Toujours traiter la recette, même sans produits
              {
                const produitIds = produitsRecette.map(p => p.id)
                const score = calculerScore(produitIds, true)
                const adapte = estAdapteAuProfil(recette)
                
                const resultatRecette: ResultatRecherche = {
                  id: `mal-${mal.id}-recette-${(recette as any).id}`,
                  idRecette: (recette as any).id,
                  type: 'recette',
                  nomRecette: `${getTypeRemede((recette as any).Type_Remede)} pour ${mal.Symptom}`,
                  description: (recette as any).Recette || `Recette traditionnelle pour traiter ${mal.Symptom}`,
                  typeApplication: getTypeApplication((recette as any).Type_Application),
                  produits: produitsRecette.length > 0 
                    ? produitsRecette.map((p: any): ProduitRecette => ({
                        id: p.id,
                        nom: p.Nom_Commun,
                        nomScientifique: p.Nom_Scientifique,
                        dansPlacard: produitsPlacardIds.includes(p.id),
                        imageUrl: p.Image_url || '🌿',
                        proprietes: p.Propriete_Principale || ''
                      }))
                    : [{
                        id: 0,
                        nom: 'Recette sans produits détaillés',
                        nomScientifique: 'Vérifiez la base de données',
                        dansPlacard: false,
                        imageUrl: '❓',
                        proprietes: 'Aucun produit associé dans RecetteProduit'
                      }],
                  produitsPlacardDisponibles: produitIds.filter(id => produitsPlacardIds.includes(id)).length,
                  sourceDocumentaire: (recette as any).Source_Documentaire || 'Pharmacopée traditionnelle',
                  adapteAuProfil: adapte,
                  raisonNonAdapte: !adapte ? getRaisonNonAdapte(recette, profil) : null,
                  score,
                  categorie: 'Recette traditionnelle',
                  imageUrl: getIconeRemede((recette as any).Type_Remede),
                  efficacite: (recette as any).Efficacite || 0.8
                }
                
                resultats.push(resultatRecette)
                console.log(`✅ [ETAPE 7] Ajouté recette: "${resultatRecette.nomRecette}"`)
              }
            } catch (errProduits: any) {
              console.warn(`⚠️ [ETAPE 7] Erreur récupération produits pour recette ${(recette as any).id}:`, errProduits.message)
            }
          }
        } catch (errRecettes: any) {
          console.warn(`⚠️ [ETAPE 7] Erreur récupération recettes pour mal "${mal.Symptom}":`, errRecettes.message)
        }
      }

      // 7. IGNORER la recherche secondaire par propriétés - on veut seulement des vraies recettes
      console.log('🔍 [ETAPE 8] Recherche secondaire ignorée (on veut seulement des recettes)')

      // 8. Éliminer les doublons et trier par score de priorité
      console.log('🔍 [ETAPE 8] Finalisation - résultats bruts:', resultats.length)
      console.log('📋 [ETAPE 8] Résultats bruts détaillés:', resultats.map(r => `${r.id} - ${r.nomRecette}`))
      
      const resultatsUniques = resultats.filter((resultat, index, self) => 
        index === self.findIndex(r => r.id === resultat.id)
      )
      
      console.log('✅ [ETAPE 8] Résultats uniques:', resultatsUniques.length)
      console.log('📋 [ETAPE 8] Résultats uniques détaillés:', resultatsUniques.map(r => `${r.id} - ${r.nomRecette}`))
      
      resultatsUniques.sort((a, b) => {
        // Tri par nombre de produits placard disponibles
        if (b.produitsPlacardDisponibles !== a.produitsPlacardDisponibles) {
          return b.produitsPlacardDisponibles - a.produitsPlacardDisponibles
        }
        // Puis par score global
        return b.score - a.score
      })
      
      console.log('✅ [ETAPE 8] Résultats triés par priorité (placard, score)')

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
        message: `${resultatsUniques.length} recette(s) trouvée(s) pour "${symptome}"`
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