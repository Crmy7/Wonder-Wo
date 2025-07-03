<template>
  <Teleport to="body">
    <div 
      v-if="disclaimerStore.isDisclaimerVisible" 
      class="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center p-4"
    >
      <!-- Background overlay avec effet blur -->
      <div class="absolute inset-0 bg-grey-black/50 backdrop-blur-sm"></div>

      <!-- Modal content -->
      <div class="relative bg-blanc rounded-3xl shadow-2xl max-w-lg w-full mx-auto border border-beige overflow-hidden">
        
        <!-- Header avec icône médicale -->
        <div class="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span class="text-3xl text-blanc">⚕️</span>
          </div>
          <h2 class="text-xl font-bold text-grey-black font-effloresce">
            Avis médical important
          </h2>
          <p class="text-sm text-grey-black/70 mt-2">
            Veuillez lire attentivement
          </p>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div class="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
            <p class="text-grey-black leading-relaxed text-center">
              L'application <strong class="text-primary">WonderWo</strong> n'a qu'un but informatif et ne
              remplace en aucun cas l'avis d'un médecin ni un
              traitement conventionnel reconnu. Appliquez ces conseils
              avec l'accord de votre médecin ou d'un professionnel de
              santé.
            </p>
          </div>

          <!-- Points clés -->
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-sm">📋</span>
              </div>
              <p class="text-sm text-grey-black/80">
                <strong>Information uniquement :</strong> Les contenus sont fournis à titre informatif
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-sm">👨‍⚕️</span>
              </div>
              <p class="text-sm text-grey-black/80">
                <strong>Consultation médicale :</strong> Consultez toujours un professionnel de santé
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-sm">🤝</span>
              </div>
              <p class="text-sm text-grey-black/80">
                <strong>Accord médical :</strong> Demandez l'accord de votre médecin avant toute application
              </p>
            </div>
          </div>
        </div>

        <!-- Footer avec bouton -->
        <div class="p-6 bg-beige/20 border-t border-beige">
          <div class="text-center space-y-4">
            <div class="flex items-center justify-center gap-2 text-sm text-grey-black/60">
              <input 
                type="checkbox" 
                id="disclaimer-understood" 
                v-model="hasUnderstood"
                class="rounded border-beige text-primary focus:ring-primary"
              />
              <label for="disclaimer-understood" class="cursor-pointer">
                J'ai lu et compris cet avertissement
              </label>
            </div>
            
            <button
              @click="acceptDisclaimer"
              :disabled="!hasUnderstood"
              class="w-full primary-btn py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              J'ai compris, continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const disclaimerStore = useDisclaimerStore()
const hasUnderstood = ref(false)

// Accepter le disclaimer
const acceptDisclaimer = () => {
  if (hasUnderstood.value) {
    disclaimerStore.markDisclaimerAsSeen()
  }
}

// Empêcher la fermeture par clic extérieur ou Escape
// Le disclaimer doit être accepté explicitement
</script>

<style scoped>
/* Animation d'entrée */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

.relative {
  animation: slideInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style> 