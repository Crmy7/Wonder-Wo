import { Recettes, Produit } from "~/server/database";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  const recette = await Recettes.findOne({
    where: { id },
    include: [{
      model: Produit,
      as: 'produits',
      through: { attributes: [] }, // Exclure les attributs de la table de liaison
      attributes: [
        'id',
        'Image_url',
        'Nom_Commun',
        'Nom_Scientifique',
        'Famille_Botanique',
        'Partie_Plante',
        'Composition',
        'Forme_Galenique',
        'Propriete_Principale',
        'Propriete_Secondaire',
        'Utilisation',
        'Precautions',
        'Source'
      ]
    }]
  });

  if (!recette) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette not found",
    });
  }

  return recette;
});