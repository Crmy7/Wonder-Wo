export const useRecette = () => {
    const getRecetteById = async (id: number) => {
        if (!id) {
            throw new Error("Recette ID is required");
        }

        try {
            const response = await fetch(`/api/recettes/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching recette: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch recette:", error);
            throw error;
        }
    }

    // Fonction pour enrichir les produits avec leur statut dans le placard
    const enrichProduitsWithPlacardStatus = async (produits: any[]) => {
        if (!produits || produits.length === 0) return [];

        const { checkInPlacard } = usePlacard();

        const enrichedProduits = await Promise.all(
            produits.map(async (produit) => {
                const inPlacard = await checkInPlacard(produit.id);
                return {
                    ...produit,
                    inPlacard
                };
            })
        );

        return enrichedProduits;
    }

    return {
        getRecetteById,
        enrichProduitsWithPlacardStatus,
    };
}
