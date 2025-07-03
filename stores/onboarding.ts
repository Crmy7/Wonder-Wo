export const useOnboardingStore = defineStore('onboarding', () => {
  // État de l'onboarding
  const hasSeenOnboarding = ref(false)
  const isOnboardingVisible = ref(false)
  const currentStep = ref(0)
  const ONBOARDING_VERSION = '1.0.0'
  const STORAGE_KEY = 'wonder-wo-onboarding'

  // Étapes de l'onboarding
  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue dans Wonder Wo',
      subtitle: 'Votre compagnon bien-être naturel',
      description: 'Découvrez une approche personnalisée de la santé naturelle. Wonder Wo vous guide vers les remèdes qui vous correspondent vraiment.',
      icon: '🌿',
      accent: 'Naturel & Personnalisé'
    },
    {
      id: 'ai',
      title: 'Intelligence Artificielle',
      subtitle: 'Des recommandations sur mesure',
      description: 'Notre IA analyse vos attentes, symptômes et profil pour vous proposer des solutions naturelles parfaitement adaptées.',
      icon: '🤖',
      accent: 'Smart & Précis'
    },
    {
      id: 'cupboard',
      title: 'Votre Placard Virtuel',
      subtitle: 'Gérez vos remèdes facilement',
      description: 'Organisez vos produits naturels, suivez vos stocks et optimisez l\'utilisation de chaque remède selon vos besoins.',
      icon: '🏺',
      accent: 'Organisé & Pratique'
    },
    {
      id: 'library',
      title: 'Bibliothèque de Savoirs',
      subtitle: 'Solutions ciblées pour vos maux',
      description: 'Accédez prioritairement aux remèdes pour vos attentes principales : stress, sommeil, anxiété, immunité, digestif.',
      icon: '📚',
      accent: 'Sagesse & Tradition'
    },
    {
      id: 'register',
      title: 'Créez Votre Compte',
      subtitle: 'Personnalisez votre expérience',
      description: 'Créez votre compte et sélectionnez vos priorités pour des recommandations ultra-personnalisées.',
      icon: '✨',
      accent: 'Votre Espace'
    }
  ]

  // État pour la personnalisation
  const userExpectations = ref<string[]>([])
  const availableExpectations = [
    'stress',
    'troubles du sommeil', 
    'anxiété',
    'immunité',
    'digestif',
    'énergie',
    'beauté naturelle',
    'détox'
  ]

  // Sauvegarder les attentes
  const saveExpectations = (expectations: string[]) => {
    userExpectations.value = expectations
    if (typeof window !== 'undefined') {
      localStorage.setItem('wonder-wo-expectations', JSON.stringify(expectations))
    }
  }

  // Charger les attentes sauvegardées
  const loadExpectations = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wonder-wo-expectations')
      if (stored) {
        userExpectations.value = JSON.parse(stored)
      }
    }
  }

  // Vérifier si l'onboarding a été vu
  const checkOnboardingStatus = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        hasSeenOnboarding.value = data.version === ONBOARDING_VERSION
      }
    }
  }

  // Marquer l'onboarding comme vu
  const markOnboardingAsSeen = () => {
    hasSeenOnboarding.value = true
    isOnboardingVisible.value = false
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: ONBOARDING_VERSION,
        completedAt: new Date().toISOString()
      }))
    }
    
    // Déclencher le disclaimer médical après l'onboarding
    // uniquement en mode guidé (nouveau utilisateur)
    if (isGuidedMode.value) {
      const disclaimerStore = useDisclaimerStore()
      setTimeout(() => {
        disclaimerStore.showDisclaimer()
      }, 500) // Petit délai pour une transition fluide
    }
  }

  // Afficher l'onboarding
  const showOnboarding = () => {
    isOnboardingVisible.value = true
    currentStep.value = 0
  }

  // Cacher l'onboarding
  const hideOnboarding = () => {
    isOnboardingVisible.value = false
  }

  // Mode onboarding (guidé ou révision)
  const isGuidedMode = ref(false) // true = avec création compte, false = révision seulement

  // Définir le mode onboarding
  const setGuidedMode = (guided: boolean) => {
    isGuidedMode.value = guided
  }

  // Getters
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === visibleSteps.value.length - 1)
  const currentStepData = computed(() => visibleSteps.value[currentStep.value])
  const progress = computed(() => ((currentStep.value + 1) / visibleSteps.value.length) * 100)

  // Étapes visibles selon le mode
  const visibleSteps = computed(() => {
    if (isGuidedMode.value) {
      // Mode guidé : toutes les étapes
      return steps
    } else {
      // Mode révision : sans l'étape de création de compte
      return steps.filter(step => step.id !== 'register')
    }
  })

  // Navigation adaptée aux étapes visibles
  const nextStep = () => {
    if (currentStep.value < visibleSteps.value.length - 1) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < visibleSteps.value.length) {
      currentStep.value = stepIndex
    }
  }

  // Reset pour développement
  const resetOnboarding = () => {
    hasSeenOnboarding.value = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    // État
    hasSeenOnboarding: readonly(hasSeenOnboarding),
    isOnboardingVisible: readonly(isOnboardingVisible),
    currentStep: readonly(currentStep),
    steps,
    visibleSteps,
    
    // Getters
    isFirstStep,
    isLastStep,
    currentStepData,
    progress,
    
    // Actions
    checkOnboardingStatus,
    markOnboardingAsSeen,
    showOnboarding,
    hideOnboarding,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
    userExpectations,
    availableExpectations,
    saveExpectations,
    loadExpectations,
    isGuidedMode,
    setGuidedMode
  }
}) 