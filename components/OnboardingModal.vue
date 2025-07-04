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
                  {{ onboardingStore.currentStep + 1 }} / {{ onboardingStore.visibleSteps.length }}
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
                v-for="(step, index) in onboardingStore.visibleSteps"
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
          <div class="flex-1 flex items-center pb-[90px] justify-center px-6 md:px-8 pt-4 overflow-y-auto max-h-[95vh] md:max-h-none">
            <Transition
              name="step"
              mode="out-in"
              appear
            >
              <div 
                :key="onboardingStore.currentStep"
                class="text-center w-full"
              >
                <!-- Étape création de compte -->
                <div v-if="onboardingStore.currentStepData.id === 'register'" class="max-w-sm mx-auto">
                  <!-- Icône animée -->
                  <div class="relative mb-4">
                    <div class="w-16 md:w-20 h-16 md:h-20 mx-auto bg-gradient-to-br from-beige to-blanc rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-1 ring-beige/50 step-icon">
                      {{ onboardingStore.currentStepData.icon }}
                    </div>
                    <div class="absolute inset-0 w-16 md:w-20 h-16 md:h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl -z-10 step-glow"></div>
                  </div>

                  <!-- Titre et description -->
                  <div class="accent-text-primary text-sm mb-2 font-hashtag">
                    {{ onboardingStore.currentStepData.accent }}
                  </div>
                  <h2 class="text-lg md:text-xl font-bold font-effloresce text-primary mb-2">
                    {{ onboardingStore.currentStepData.title }}
                  </h2>
                  <h3 class="text-sm md:text-base font-medium font-sans text-secondary mb-3">
                    {{ onboardingStore.currentStepData.subtitle }}
                  </h3>
                  <p class="text-grey-black/80 leading-relaxed font-sans text-sm mb-4">
                    {{ onboardingStore.currentStepData.description }}
                  </p>

                  <!-- Formulaire d'inscription -->
                  <form @submit.prevent="handleRegister" class="space-y-4 text-left">
                    <div>
                      <label class="block text-sm font-medium mb-1 text-grey-black">Email</label>
                      <input
                        v-model="registerForm.email"
                        type="email"
                        name="email"
                        required
                        class="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium mb-1 text-grey-black">Mot de passe</label>
                      <input
                        v-model="registerForm.password"
                        type="password"
                        required
                        name="password"
                        class="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="Min. 6 caractères"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium mb-1 text-grey-black">Confirmer</label>
                      <input
                        v-model="registerForm.confirmPassword"
                        type="password"
                        required
                        name="confirmPassword"
                        class="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="Répétez le mot de passe"
                      />
                    </div>

                    <!-- Sélection des maux courants -->
                    <div class="pt-2">
                      <label class="block text-sm font-medium mb-3 text-grey-black">
                        Vos maux courants (optionnel)
                      </label>
                      <p class="text-xs text-grey-black/60 mb-3">
                        Sélectionnez les maux que vous rencontrez régulièrement pour des recommandations optimisées selon votre placard
                      </p>
                      
                      <!-- Chargement des maux -->
                      <div v-if="mauxLoading" class="text-center py-4">
                        <div class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                        <p class="text-xs text-grey-black/60">Chargement des maux...</p>
                      </div>
                      
                      <!-- Liste des maux -->
                      <div v-else class="grid grid-cols-1 gap-2 mb-3 max-h-60 overflow-y-auto">
                        <button
                          v-for="mal in availableMaux"
                          :key="mal.id"
                          type="button"
                          @click="toggleMal(mal.id)"
                          :class="[
                            'p-3 rounded-lg border transition-all duration-200 text-xs font-medium text-left',
                            selectedMaux.includes(mal.id)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-grey-black/20 bg-blanc hover:border-primary/40 text-grey-black'
                          ]"
                        >
                          <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded border" :class="selectedMaux.includes(mal.id) ? 'bg-primary border-primary' : 'border-grey-black/30'">
                              <svg v-if="selectedMaux.includes(mal.id)" class="w-2 h-2 text-blanc m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                              </svg>
                            </div>
                            <span class="text-lg">{{ mal.icon }}</span>
                            <div class="flex-1">
                              <span class="font-medium">{{ mal.symptom }}</span>
                              <span class="text-xs text-grey-black/50 ml-1">({{ mal.category }})</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      
                      <p class="text-xs text-grey-black/60 text-center">
                        {{ selectedMaux.length }} mal(aux) sélectionné(s)
                      </p>
                    </div>

                    <!-- Messages d'erreur/succès -->
                    <div v-if="registerError" class="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <p class="text-secondary text-xs font-medium">{{ registerError }}</p>
                    </div>
                    
                    <div v-if="registerSuccess" class="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p class="text-primary text-xs font-medium">{{ registerSuccess }}</p>
                    </div>
                  </form>
                </div>

                <!-- Autres étapes (contenu par défaut) -->
                <div v-else>
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
const authStore = useAuthStore()

// État local pour les maux sélectionnés
const selectedMaux = ref<number[]>([])
const availableMaux = ref<any[]>([])
const mauxLoading = ref(false)

// État pour le formulaire d'inscription
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const registerError = ref('')
const registerSuccess = ref('')

// Basculer un mal
const toggleMal = (malId: number) => {
  const index = selectedMaux.value.indexOf(malId)
  if (index > -1) {
    selectedMaux.value.splice(index, 1)
  } else {
    selectedMaux.value.push(malId)
  }
}

// Charger les maux disponibles
const loadAvailableMaux = async () => {
  mauxLoading.value = true
  try {
    const response = await $fetch('/api/maux/selection')
    availableMaux.value = response.maux || []
  } catch (error) {
    console.error('Erreur chargement maux:', error)
    availableMaux.value = []
  } finally {
    mauxLoading.value = false
  }
}

// Gestion de l'inscription dans l'onboarding
const handleRegister = async () => {
  registerError.value = ''
  registerSuccess.value = ''
  
  // Validation côté client
  if (registerForm.password !== registerForm.confirmPassword) {
    registerError.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (registerForm.password.length < 6) {
    registerError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  try {
    await authStore.register(registerForm.email, registerForm.password)
    
    // Attendre un petit délai pour que l'authentification soit effective
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Sauvegarder les maux courants sélectionnés
    if (selectedMaux.value.length > 0) {
      try {
        await $fetch('/api/user/maux-courants', {
          method: 'POST',
          body: { 
            mauxIds: selectedMaux.value,
            action: 'replace'
          }
        })
        console.log('✅ Maux courants sauvegardés:', selectedMaux.value)
      } catch (error) {
        console.error('❌ Erreur sauvegarde maux courants:', error)
        // Stocker temporairement pour tentative ultérieure
        if (typeof window !== 'undefined') {
          localStorage.setItem('pending-maux-courants', JSON.stringify(selectedMaux.value))
        }
      }
    }
    
    registerSuccess.value = 'Compte créé avec succès ! 🎉'
    
    // Attendre un peu puis terminer l'onboarding
    setTimeout(() => {
      onboardingStore.markOnboardingAsSeen()
      navigateTo('/profil')
    }, 2000)
    
  } catch (err: any) {
    registerError.value = authStore.error || 'Erreur lors de la création du compte'
    console.error('Erreur inscription onboarding:', err)
  }
}

const handleNext = () => {
  // Si on est sur l'étape d'inscription, valider le formulaire
  if (onboardingStore.currentStepData.id === 'register') {
    handleRegister()
    return
  }
  
  if (onboardingStore.isLastStep) {
    // Terminer l'onboarding
    onboardingStore.markOnboardingAsSeen()
    navigateTo('/profil')
  } else {
    onboardingStore.nextStep()
  }
}

const handleSkip = () => {
  // En mode guidé, ne pas permettre de passer la création de compte
  if (onboardingStore.isGuidedMode && onboardingStore.currentStepData.id === 'register') {
    return
  }
  onboardingStore.markOnboardingAsSeen()
}

// Charger les maux au montage
onMounted(() => {
  loadAvailableMaux()
})

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