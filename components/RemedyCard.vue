<template>
  <div
    class="bg-blanc border rounded-2xl p-6 border-primary/40 transition-all duration-300 hover:shadow-lg"
  >
    <!-- En-tête de la carte -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">{{ remedy.imageUrl }}</span>
          <h3 class="font-effloresce text-lg text-primary">
            {{ remedy.nomRecette }}
          </h3>
          <span
            v-if="remedy.type === 'recette'"
            class="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
          >
            Recette
          </span>
          <span
            v-else
            class="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full"
          >
            Produit simple
          </span>
        </div>

        <p class="text-grey-black/80 text-sm mb-2 leading-relaxed">
          {{ remedy.description }}
        </p>

        <div class="flex items-center gap-3 text-xs text-grey-black/60">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-secondary rounded-full"></span>
            {{ remedy.typeApplication }}
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 bg-primary rounded-full"></span>
            {{ remedy.categorie }}
          </span>
          <span v-if="remedy.efficacite" class="flex items-center gap-1">
            <span class="text-yellow-500">⭐</span>
            {{ Math.round(remedy.efficacite * 100) }}%
          </span>
        </div>
      </div>

      <!-- Statut placard -->
      <div class="ml-4">
        <div
          v-if="remedy.produitsPlacardDisponibles > 0"
          class="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1"
        >
          <span>🏺</span>
          {{ remedy.produitsPlacardDisponibles }}/{{ remedy.produits.length }}
          dans le placard
        </div>
        <div
          v-else
          class="bg-grey-black/10 text-grey-black/60 text-xs px-3 py-1 rounded-full"
        >
          Produits manquants
        </div>
      </div>
    </div>

    <!-- Adaptation au profil -->
    <div
      v-if="!remedy.adapteAuProfil"
      class="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4"
    >
      <div class="flex items-center gap-2 text-orange-700">
        <span class="text-sm">⚠️</span>
        <span class="text-sm font-medium">Attention</span>
      </div>
      <p class="text-orange-600 text-xs mt-1">{{ remedy.raisonNonAdapte }}</p>
    </div>

    <!-- Liste des produits -->
    <div class="space-y-3 mb-4">
      <h4 class="text-primary font-semibold text-sm">
        <span v-if="hasValidProducts">Produits nécessaires ({{ remedy.produits.length }}) :</span>
        <span v-else class="text-orange-600">⚠️ Recette sans produits détaillés</span>
      </h4>

      <!-- Message pour les recettes sans produits -->
      <div v-if="!hasValidProducts" class="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div class="flex items-center gap-2 text-orange-700 mb-2">
          <span class="text-lg">📋</span>
          <span class="font-medium">Recette disponible mais produits manquants</span>
        </div>
        <p class="text-orange-600 text-sm">
          Cette recette existe dans notre base de données mais les produits nécessaires ne sont pas encore référencés. 
          Contactez notre équipe pour plus d'informations.
        </p>
      </div>

      <!-- Liste des produits (si disponibles) -->
      <div v-else class="grid gap-3 grid-cols-1">
        <div
          v-for="produit in remedy.produits"
          :key="produit.id"
          class="flex items-center justify-between bg-beige/20 rounded-xl w-full max-w-[250px]"
        >
          <div
            class="flex items-center gap-3 p-5 rounded-lg w-full"
            :class="
              produit.dansPlacard
                ? 'bg-primary/10 text-primary border-primary border-[0.5px]'
                : 'border-primary border-[0.25px]'
            "
          >
            <span
              class="text-lg"
              :class="{ 'text-primary': produit.dansPlacard }"
              >{{ produit.imageUrl }}</span
            >
            <div
              class="flex-1 min-w-0"
              :class="{ 'text-primary': produit.dansPlacard }"
            >
              <h5
                class="font-bold text-sm truncate"
                :class="
                  produit.dansPlacard ? 'text-primary' : 'text-grey-black'
                "
              >
                {{ produit.nom }}
              </h5>
              <p
                class="text-grey-black/60 text-xs italic truncate"
                :class="{ 'text-primary': produit.dansPlacard }"
              >
                {{ produit.nomScientifique }}
              </p>
              <p
                v-if="produit.proprietes"
                class="text-grey-black/70 text-xs truncate"
                :class="{ 'text-primary': produit.dansPlacard }"
              >
                {{ produit.proprietes }}
              </p>
              <div class="flex items-center gap-1 mt-1">
                <span v-if="produit.dansPlacard" class="text-xs font-medium"
                  >✓ Dans votre placard</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-4 border-t border-beige">
      <!-- Ajouter tous les produits manquants -->

      <!-- Voir les détails -->
      <NuxtLink
        :to="`./recettes/${remedy.idRecette}`"
        class="bg-beige/40 hover:bg-primary hover:text-blanc transition-all duration-300 text-primary px-3 py-1 rounded-full border border-primary/40 font-medium text-sm"
      >
        <span>Voir détails</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import type { ResultatRecherche } from "~/types/maux";

// Props
interface Props {
  remedy: ResultatRecherche;
}

const props = defineProps<Props>();

// État local
const loadingPlacard = ref(false);

// Composables
const { addToPlacard } = usePlacard();

// Computed
const hasValidProducts = computed(() => {
  return props.remedy.produits.length > 0 && props.remedy.produits[0].id !== 0;
});

// Émissions
const emit = defineEmits<{
  "products-added": [];
}>();

// Ajouter tous les produits manquants au placard
const addAllToplacard = async () => {
  loadingPlacard.value = true;
  try {
    const produitsAAjouter = props.remedy.produits.filter(
      (p) => !p.dansPlacard
    );

    for (const produit of produitsAAjouter) {
      await addToPlacard(produit.id);
    }

    emit("products-added");
  } catch (error) {
    console.error("Erreur ajout multiple au placard:", error);
  } finally {
    loadingPlacard.value = false;
  }
};
</script>

<style scoped>
/* Animations pour les cartes */
.hover\:shadow-lg:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation pour la barre de progression */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
