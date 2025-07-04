<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
    <div class="bg-blanc rounded-2xl max-w-lg w-full p-6 animate-slide-up">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">🏺</span>
        </div>
        <h3 class="text-xl font-semibold text-grey-black mb-2">
          Créez votre placard virtuel !
        </h3>
        <p class="text-sm text-grey-black/70">
          Ajoutez vos produits pour recevoir des recommandations personnalisées et découvrir les recettes que vous pouvez réaliser immédiatement.
        </p>
      </div>

      <!-- Avantages -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
          <span class="text-lg">✨</span>
          <span class="text-sm font-medium">Recettes personnalisées selon vos produits</span>
        </div>
        <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
          <span class="text-lg">🎯</span>
          <span class="text-sm font-medium">Priorité aux remèdes réalisables</span>
        </div>
        <div class="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
          <span class="text-lg">📦</span>
          <span class="text-sm font-medium">Gestion intelligente de votre stock</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3">
        <button
          @click="goToPlacard"
          class="bg-primary text-blanc px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          🏺 Créer mon placard maintenant
        </button>
        <button
          @click="skipForNow"
          class="text-grey-black/60 text-sm py-2 hover:text-grey-black transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  gotoPlacard: []
}>()

const goToPlacard = () => {
  emit('gotoPlacard')
  emit('close')
}

const skipForNow = () => {
  emit('close')
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style> 