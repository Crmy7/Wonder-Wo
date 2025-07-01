<template>
  <Teleport to="body">
    <div 
      v-if="onboardingStore.isOnboardingVisible" 
      class="fixed inset-0 z-[9999] overflow-hidden"
      @click.self="handleSkip"
    >
      <!-- Background overlay avec effet glassmorphism -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/30 md:from-primary/20 via-secondary/20 md:via-secondary/10 to-beige/40 md:to-beige/30 backdrop-blur-sm">
        <div class="absolute inset-0 onboarding-pattern opacity-30 md:opacity-50"></div>
      </div>

      <!-- Contenu de l'onboarding -->
      <div class="relative h-full flex flex-col md:items-center md:justify-center p-0 md:p-4">
        <div class="bg-blanc/98 md:bg-blanc/95 backdrop-blur-xl rounded-none md:rounded-3xl shadow-none md:shadow-2xl max-w-lg w-full h-full md:h-auto mx-auto border-0 md:border md:border-beige/50 overflow-hidden flex flex-col">
          
          <!-- Header avec progression -->
          <div class="relative p-6 md:p-8 pb-4 md:pb-6 pt-8 md:pt-8">
            <!-- Bouton fermer -->
            <button 
              @click="handleSkip"
              class="absolute top-4 right-4 w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-grey-black/10 hover:bg-grey-black/20 transition-all duration-300 text-grey-black/70 hover:text-grey-black backdrop-blur-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Barre de progression -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-medium text-grey-black/60 font-sans">
                  {{ onboardingStore.currentStep + 1 }} / {{ onboardingStore.steps.length }}
                </span>
                <span class="text-xs font-medium text-grey-black/60 font-sans">
                  {{ Math.round(onboardingStore.progress) }}%
                </span>
              </div>
              <div class="h-1 bg-beige rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
                  :style="{ width: `${onboardingStore.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Indicateurs de points -->
            <div class="flex justify-center space-x-3 mb-4">
              <button
                v-for="(step, index) in onboardingStore.steps"
                :key="step.id"
                @click="onboardingStore.goToStep(index)"
                class="w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-110"
                :class="index === onboardingStore.currentStep 
                  ? 'bg-primary scale-125 shadow-sm' 
                  : index < onboardingStore.currentStep 
                    ? 'bg-secondary opacity-80' 
                    : 'bg-primary/30 opacity-40 hover:opacity-60'"
              ></button>
            </div>
          </div>

          <!-- Contenu principal avec animations -->
          <div class="flex-1 flex items-center justify-center px-6 md:px-8 py-8 md:py-4 pb-24 md:pb-4">
            <Transition
              name="step"
              mode="out-in"
              appear
            >
              <div 
                :key="onboardingStore.currentStep"
                class="text-center w-full"
              >
                <!-- Icône animée -->
                <div class="relative mb-6">
                  <div class="w-20 md:w-24 h-20 md:h-24 mx-auto bg-gradient-to-br from-beige to-blanc rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-lg ring-1 ring-beige/50 step-icon">
                    {{ onboardingStore.currentStepData.icon }}
                  </div>
                  <!-- Effet de glow -->
                  <div class="absolute inset-0 w-20 md:w-24 h-20 md:h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl -z-10 step-glow"></div>
                </div>

                <!-- Accent text -->
                <div class="accent-text-primary text-sm mb-2 font-hashtag">
                  {{ onboardingStore.currentStepData.accent }}
                </div>

                <!-- Titre principal -->
                <h2 class="text-xl md:text-2xl font-bold font-effloresce text-primary mb-2">
                  {{ onboardingStore.currentStepData.title }}
                </h2>

                <!-- Sous-titre -->
                <h3 class="text-base md:text-lg font-medium font-sans text-secondary mb-4">
                  {{ onboardingStore.currentStepData.subtitle }}
                </h3>

                <!-- Description -->
                <p class="text-grey-black/80 leading-relaxed font-sans text-sm md:text-base">
                  {{ onboardingStore.currentStepData.description }}
                </p>
              </div>
            </Transition>
          </div>

          <!-- Footer avec boutons -->
          <div class="fixed md:relative bottom-0 left-0 right-0 md:static p-4 pb-6 md:pb-8 md:p-8 md:pt-6 border-t border-grey-black/10 bg-blanc/98 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
            <!-- Mobile: tous les boutons sur une ligne -->
            <div class="flex md:hidden items-center justify-between space-x-2">
              <!-- Bouton Précédent mobile -->
              <button 
                @click="onboardingStore.previousStep"
                :disabled="onboardingStore.isFirstStep"
                class="flex-1 px-3 py-3 text-grey-black/60 hover:text-grey-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-medium font-sans text-sm rounded-full border border-grey-black/20 hover:border-grey-black/40"
              >
                ← Préc.
              </button>

              <!-- Bouton Passer mobile -->
              <button 
                @click="handleSkip"
                class="flex-1 px-3 py-3 text-grey-black/60 hover:text-grey-black transition-all duration-300 font-medium font-sans text-sm rounded-full border border-grey-black/20 hover:border-grey-black/40"
              >
                Passer
              </button>
              
              <!-- Bouton Suivant mobile -->
              <button 
                @click="handleNext"
                class="primary-btn flex-1 py-3 font-medium relative overflow-hidden group text-sm"
              >
                <span class="relative z-10">
                  {{ onboardingStore.isLastStep ? '🚀 Go' : 'Suivant →' }}
                </span>
                <!-- Effet de vague au hover -->
                <div class="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <!-- Desktop: layout original -->
            <div class="hidden md:flex items-center justify-between">
              <!-- Bouton Précédent desktop -->
              <button 
                @click="onboardingStore.previousStep"
                :disabled="onboardingStore.isFirstStep"
                class="px-6 py-2 text-grey-black/60 hover:text-grey-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-medium font-sans"
              >
                ← Précédent
              </button>

              <!-- Boutons principaux desktop -->
              <div class="flex space-x-3">
                <button 
                  @click="handleSkip"
                  class="px-4 py-2 text-grey-black/60 hover:text-grey-black transition-all duration-300 font-medium font-sans rounded-full border border-grey-black/20 hover:border-grey-black/40"
                >
                  Passer
                </button>
                
                <button 
                  @click="handleNext"
                  class="primary-btn min-w-[120px] py-2 font-medium relative overflow-hidden group"
                >
                  <span class="relative z-10">
                    {{ onboardingStore.isLastStep ? '🚀 Commencer' : 'Suivant →' }}
                  </span>
                  <!-- Effet de vague au hover -->
                  <div class="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const onboardingStore = useOnboardingStore()

const handleNext = () => {
  if (onboardingStore.isLastStep) {
    // Terminer l'onboarding
    onboardingStore.markOnboardingAsSeen()
  } else {
    onboardingStore.nextStep()
  }
}

const handleSkip = () => {
  onboardingStore.markOnboardingAsSeen()
}

// Navigation au clavier
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!onboardingStore.isOnboardingVisible) return
    
    switch (event.key) {
      case 'ArrowRight':
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleNext()
        break
      case 'ArrowLeft':
        event.preventDefault()
        onboardingStore.previousStep()
        break
      case 'Escape':
        event.preventDefault()
        handleSkip()
        break
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        event.preventDefault()
        const stepIndex = parseInt(event.key) - 1
        onboardingStore.goToStep(stepIndex)
        break
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* Animations pour les transitions d'étapes */
.step-enter-active,
.step-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.step-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.step-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Animation de l'icône */
.step-icon {
  animation: float 3s ease-in-out infinite;
}

.step-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes glow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Effet de parallax subtil pour le background */
.fixed {
  animation: backgroundShift 20s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}
</style> 