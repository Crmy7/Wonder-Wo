export const usePlacardOnboarding = () => {
  const showModal = ref(false)
  
  // Cookie pour savoir si l'onboarding placard a été fait
  const placardOnboardingDone = useCookie('placardOnboardingDone', {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365 // 1 an
  })

  // Afficher la modal si c'est le premier profil et que l'onboarding n'a pas été fait
  const checkAndShowModal = (isFirstProfile: boolean) => {
    if (isFirstProfile && !placardOnboardingDone.value) {
      // Petit délai pour que l'utilisateur voie d'abord le succès de création
      setTimeout(() => {
        showModal.value = true
      }, 1500)
    }
  }

  // Fermer la modal
  const closeModal = () => {
    showModal.value = false
    placardOnboardingDone.value = true
  }

  // Aller au placard
  const goToPlacard = async () => {
    placardOnboardingDone.value = true
    await navigateTo('/placard')
  }

  // Réinitialiser l'onboarding (pour les tests ou admin)
  const resetOnboarding = () => {
    placardOnboardingDone.value = false
  }

  return {
    showModal: readonly(showModal),
    checkAndShowModal,
    closeModal,
    goToPlacard,
    resetOnboarding
  }
} 