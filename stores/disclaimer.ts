export const useDisclaimerStore = defineStore('disclaimer', () => {
  // État du disclaimer
  const hasSeenDisclaimer = ref(false)
  const isDisclaimerVisible = ref(false)
  const DISCLAIMER_VERSION = '1.0.0'
  const STORAGE_KEY = 'wonder-wo-disclaimer'

  // Vérifier si le disclaimer a été vu
  const checkDisclaimerStatus = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        hasSeenDisclaimer.value = data.version === DISCLAIMER_VERSION
      }
    }
  }

  // Marquer le disclaimer comme vu
  const markDisclaimerAsSeen = () => {
    hasSeenDisclaimer.value = true
    isDisclaimerVisible.value = false
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: DISCLAIMER_VERSION,
        seenAt: new Date().toISOString()
      }))
    }
  }

  // Afficher le disclaimer
  const showDisclaimer = () => {
    // Ne montrer que si pas déjà vu
    if (!hasSeenDisclaimer.value) {
      isDisclaimerVisible.value = true
    }
  }

  // Cacher le disclaimer
  const hideDisclaimer = () => {
    isDisclaimerVisible.value = false
  }

  // Reset pour développement
  const resetDisclaimer = () => {
    hasSeenDisclaimer.value = false
    isDisclaimerVisible.value = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    // État
    hasSeenDisclaimer: readonly(hasSeenDisclaimer),
    isDisclaimerVisible: readonly(isDisclaimerVisible),
    
    // Actions
    checkDisclaimerStatus,
    markDisclaimerAsSeen,
    showDisclaimer,
    hideDisclaimer,
    resetDisclaimer
  }
}) 