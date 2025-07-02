import { Recettes } from "~/server/database";

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
  });

  if (!recette) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recette not found",
    });
  }

  return recette;
});