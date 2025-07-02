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
      const { Maux, Produit, Recettes, Placard } = await import('~/server/database')
      
      console.log('🔍 Recherche de remèdes pour symptôme:', symptome, 'utilisateur:', IdUser)
      
      // 1. Récupérer les produits du placard de l'utilisateur
      const placardUtilisateur = await Placard.findAll({
        where: { IdUser }
      })
      
      const produitsPlacardIds: number[] = placardUtilisateur.map((item: any) => item.IdProduit)
      console.log('📦 Produits dans le placard:', produitsPlacardIds)

      // 2. Recherche dans les maux correspondant au symptôme
      const mauxTrouves = await Maux.findAll({
        where: {
          Symptom: {
            [Op.iLike]: `%${symptome}%`
          }
        }
      })

      // 3. Pour chaque mal trouvé, chercher les recettes et produits liés
      const recettesAssociees = []
      for (const mal of mauxTrouves) {
        // Trouver les recettes liées via les tables de liaison
        const recettes = await Recettes.findAll({
          include: [
            {
              model: Maux,
              as: 'maux',
              where: { id: mal.id },
              through: { attributes: [] }
            }
          ]
        })
        
        // Pour chaque recette, trouver les produits
        for (const recette of recettes) {
          const produits = await Produit.findAll({
            include: [
              {
                model: Recettes,
                as: 'recettes',
                where: { id: recette.id },
                through: { attributes: [] }
              }
            ],
            attributes: [
              'id', 'Nom_Commun', 'Nom_Scientifique', 
              'Propriete_Principale', 'Propriete_Secondaire',
              'Utilisation', 'Precautions', 'Image_url'
            ]
          })
          
          recettesAssociees.push({
            mal: mal,
            recette: recette,
            produits: produits
          })
        }
      }

      // 4. Recherche directe dans les produits par propriétés
      const produitsRecommandes = await Produit.findAll({
        where: {
          [Op.or]: [
            {
              Propriete_Principale: {
                [Op.iLike]: `%${symptome}%`
              }
            },
            {
              Propriete_Secondaire: {
                [Op.iLike]: `%${symptome}%`
              }
            },
            {
              Utilisation: {
                [Op.iLike]: `%${symptome}%`
              }
            }
          ]
        },
        attributes: [
          'id', 'Nom_Commun', 'Nom_Scientifique', 
          'Propriete_Principale', 'Propriete_Secondaire',
          'Utilisation', 'Precautions', 'Image_url'
        ]
      })

      // 5. Pour chaque produit recommandé, chercher ses recettes
      const produitsAvecRecettes = []
      for (const produit of produitsRecommandes) {
        const recettes = await Recettes.findAll({
          include: [
            {
              model: Produit,
              as: 'produits',
              where: { id: produit.id },
              through: { attributes: [] }
            }
          ],
          attributes: [
            'id', 'Type_Remede', 'Type_Application', 'Recette',
            'Tranche_age', 'Femme_Enceinte', 'Source_Documentaire', 'Efficacite'
          ]
        })
        
        produitsAvecRecettes.push({
          produit: produit,
          recettes: recettes
        })
      }

      // 4. Formater et prioriser les résultats
      const resultats: ResultatRecherche[] = []
      const recettesDejaAjoutees = new Set<number>()

      // Fonction pour vérifier l'adaptation au profil
      const estAdapteAuProfil = (recette: any): boolean => {
        if (!profil) return true
        
        // Vérifier grossesse
        if (profil.grossesse && !recette.Femme_Enceinte) {
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
      const calculerScore = (recette: any, produitsDansRecette: any[]): number => {
        let score = recette.Efficacite || 0.5
        
        // Boost si produits du placard disponibles
        const produitsPlacardDansRecette = produitsDansRecette.filter((p: any) => 
          produitsPlacardIds.includes(p.id)
        )
        
        if (produitsPlacardDansRecette.length > 0) {
          score += 0.4 + (produitsPlacardDansRecette.length * 0.1)
        }
        
        // Boost si adapté au profil
        if (estAdapteAuProfil(recette)) {
          score += 0.2
        }
        
        return Math.min(score, 1.0) // Cap à 1.0
      }

      // 6. Traiter les recettes trouvées via maux
      recettesAssociees.forEach((association: any) => {
        const { mal, recette, produits } = association
        
        const produitsDansRecette = produits || []
        const produitsPlacardDansRecette = produitsDansRecette.filter((p: any) => 
          produitsPlacardIds.includes(p.id)
        )
        
        const score = calculerScore(recette, produitsDansRecette)
        const adapte = estAdapteAuProfil(recette)
        
        const resultat: ResultatRecherche = {
          id: `mal-${mal.id}-recette-${recette.id}`,
          type: 'recette',
          nomRecette: `Remède ${getTypeRemede(recette.Type_Remede)} pour ${mal.Symptom}`,
          description: recette.Recette,
          typeApplication: getTypeApplication(recette.Type_Application),
          produits: produitsDansRecette.map((p: any): ProduitRecette => ({
            id: p.id,
            nom: p.Nom_Commun,
            nomScientifique: p.Nom_Scientifique,
            dansPlacard: produitsPlacardIds.includes(p.id),
            imageUrl: p.Image_url || '🌿',
            proprietes: p.Propriete_Principale
          })),
          produitsPlacardDisponibles: produitsPlacardDansRecette.length,
          sourceDocumentaire: recette.Source_Documentaire || 'Pharmacopée traditionnelle',
          adapteAuProfil: adapte,
          raisonNonAdapte: !adapte ? getRaisonNonAdapte(recette, profil) : null,
          score,
          categorie: 'Recette traditionnelle',
          imageUrl: getIconeRemede(recette.Type_Remede),
          efficacite: recette.Efficacite || 0.7
        }
        
        resultats.push(resultat)
      })

      // 7. Traiter les produits trouvés directement
      produitsAvecRecettes.forEach((association: any) => {
        const { produit, recettes } = association
        const dansPlacard = produitsPlacardIds.includes(produit.id)
        
        // Ajouter le produit comme remède simple
        const resultatProduit: ResultatRecherche = {
          id: `produit-${produit.id}`,
          type: 'produit_simple',
          nomRecette: `Usage de ${produit.Nom_Commun}`,
          description: produit.Utilisation,
          typeApplication: 'Usage direct',
          produits: [{
            id: produit.id,
            nom: produit.Nom_Commun,
            nomScientifique: produit.Nom_Scientifique,
            dansPlacard,
            imageUrl: produit.Image_url || '🌿',
            proprietes: produit.Propriete_Principale
          }],
          produitsPlacardDisponibles: dansPlacard ? 1 : 0,
          sourceDocumentaire: 'Propriétés thérapeutiques',
          adapteAuProfil: true,
          raisonNonAdapte: null,
          score: dansPlacard ? 0.8 : 0.6,
          categorie: 'Produit naturel',
          imageUrl: produit.Image_url || '🌿',
          efficacite: 0.7
        }
        resultats.push(resultatProduit)

        // Ajouter ses recettes associées
        recettes?.forEach((recette: any) => {
          const score = calculerScore(recette, [produit])
          const adapte = estAdapteAuProfil(recette)
          
          const resultatRecette: ResultatRecherche = {
            id: `produit-${produit.id}-recette-${recette.id}`,
            type: 'recette',
            nomRecette: `Recette avec ${produit.Nom_Commun}`,
            description: recette.Recette,
            typeApplication: getTypeApplication(recette.Type_Application),
            produits: [{
              id: produit.id,
              nom: produit.Nom_Commun,
              nomScientifique: produit.Nom_Scientifique,
              dansPlacard,
              imageUrl: produit.Image_url || '🌿',
              proprietes: produit.Propriete_Principale
            }],
            produitsPlacardDisponibles: dansPlacard ? 1 : 0,
            sourceDocumentaire: recette.Source_Documentaire || 'Recettes traditionnelles',
            adapteAuProfil: adapte,
            raisonNonAdapte: !adapte ? getRaisonNonAdapte(recette, profil) : null,
            score,
            categorie: 'Recette spécialisée',
            imageUrl: getIconeRemede(recette.Type_Remede),
            efficacite: recette.Efficacite || 0.7
          }
          
          resultats.push(resultatRecette)
        })
      })

      // 8. Éliminer les doublons et trier par score de priorité (placard d'abord)
      const resultatsUniques = resultats.filter((resultat, index, self) => 
        index === self.findIndex(r => r.id === resultat.id)
      )
      
      resultatsUniques.sort((a, b) => {
        // D'abord par nombre de produits placard disponibles
        if (b.produitsPlacardDisponibles !== a.produitsPlacardDisponibles) {
          return b.produitsPlacardDisponibles - a.produitsPlacardDisponibles
        }
        // Puis par score global
        return b.score - a.score
      })

      return {
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

    } catch (dbError) {
      console.log('MySQL non disponible pour maux')
      throw createError({
        statusCode: 503,
        statusMessage: 'Base de données non disponible. Veuillez vérifier que MySQL est démarré et configuré.'
      })
    }

  } catch (error: any) {
    console.error('Erreur recherche maux:', error.message)
    
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