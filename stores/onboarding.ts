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
      description: 'Notre IA analyse vos symptômes, votre profil et vos préférences pour vous proposer des solutions naturelles adaptées.',
      icon: '🤖',
      accent: 'Smart & Précis'
    },
    {
      id: 'cupboard',
      title: 'Votre Placard Virtuel',
      subtitle: 'Gérez vos remèdes facilement',
      description: 'Organisez vos produits naturels, suivez vos stocks et optimisez l\'utilisation de chaque remède.',
      icon: '🏺',
      accent: 'Organisé & Pratique'
    },
    {
      id: 'library',
      title: 'Bibliothèque de Savoirs',
      subtitle: 'Explorez les remèdes ancestraux',
      description: 'Accédez à notre base de connaissances complète avec conseils d\'experts et traditions naturelles.',
      icon: '📚',
      accent: 'Sagesse & Tradition'
    },
    {
      id: 'start',
      title: 'Prêt à Commencer ?',
      subtitle: 'Votre voyage bien-être vous attend',
      description: 'Créez votre profil personnalisé et recevez vos premières recommandations adaptées à vos besoins.',
      icon: '✨',
      accent: 'Votre Aventure'
    }
  ]

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

  // Navigation
  const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      currentStep.value = stepIndex
    }
  }

  // Getters
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === steps.length - 1)
  const currentStepData = computed(() => steps[currentStep.value])
  const progress = computed(() => ((currentStep.value + 1) / steps.length) * 100)

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
    resetOnboarding
  }
}) 