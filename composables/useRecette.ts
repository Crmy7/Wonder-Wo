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

    return {
        getRecetteById,
    };
}
