export const useProfils = () => {
  const profilStore = useProfilStore()
  const authStore = useAuthStore()

  // Exposer les données du store de manière reactive
  const profils = computed(() => profilStore.profils)
  const currentProfil = computed(() => profilStore.currentProfil)
  const hasProfiles = computed(() => profilStore.hasProfiles)
  const loading = computed(() => profilStore.loading)
  const error = computed(() => profilStore.error)
  const profilCount = computed(() => profilStore.profilCount)

  // Actions
  const loadProfils = async () => {
    if (!authStore.isLoggedIn) return
    return await profilStore.loadProfils()
  }

  const selectProfil = async (profil: any) => {
    return await profilStore.selectProfil(profil)
  }

  const createProfil = async (profilData: any) => {
    return await profilStore.createProfil(profilData)
  }

  const deleteProfil = async (profilId: number) => {
    return await profilStore.deleteProfil(profilId)
  }

  const clearError = () => {
    profilStore.clearError()
  }

  const resetStore = () => {
    profilStore.resetStore()
  }

  // Auto-charge les profils si l'utilisateur est connecté
  const initProfils = async () => {
    if (authStore.isLoggedIn && profilStore.profils.length === 0) {
      await loadProfils()
    }
  }

  return {
    // État réactif
    profils: readonly(profils),
    currentProfil: readonly(currentProfil),
    hasProfiles: readonly(hasProfiles),
    loading: readonly(loading),
    error: readonly(error),
    profilCount: readonly(profilCount),
    
    // Actions
    loadProfils,
    selectProfil,
    createProfil,
    deleteProfil,
    clearError,
    resetStore,
    initProfils
  }
} 