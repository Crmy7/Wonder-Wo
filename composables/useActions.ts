export interface ActionOptions {
  confirmMessage?: string
  loadingMessage?: string
  successMessage?: string
  errorMessage?: string
  autoRedirect?: string
  redirectDelay?: number
}

export const useActions = () => {
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // Exécuter une action avec gestion d'état
  const executeAction = async <T>(
    actionFn: () => Promise<T>,
    options: ActionOptions = {}
  ): Promise<T | null> => {
    // Confirmation si demandée
    if (options.confirmMessage) {
      if (!confirm(options.confirmMessage)) {
        return null
      }
    }

    loading.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await actionFn()
      
      if (options.successMessage) {
        success.value = options.successMessage
      }

      // Redirection automatique si demandée
      if (options.autoRedirect) {
        setTimeout(() => {
          navigateTo(options.autoRedirect!)
        }, options.redirectDelay || 1500)
      }

      return result
    } catch (err: any) {
      console.error('Erreur action:', err)
      error.value = options.errorMessage || err.statusMessage || err.message || 'Une erreur est survenue'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Action de suppression avec confirmation
  const deleteAction = async <T>(
    deleteFn: () => Promise<T>,
    itemName = 'cet élément'
  ): Promise<T | null> => {
    return executeAction(deleteFn, {
      confirmMessage: `Êtes-vous sûr de vouloir supprimer ${itemName} ?`,
      successMessage: 'Suppression réussie',
      errorMessage: 'Erreur lors de la suppression'
    })
  }

  // Action de déconnexion
  const logoutAction = async (logoutFn: () => Promise<any>): Promise<any | null> => {
    return executeAction(logoutFn, {
      successMessage: 'Déconnexion réussie',
      errorMessage: 'Erreur lors de la déconnexion',
      autoRedirect: '/',
      redirectDelay: 1000
    })
  }

  // Effacer les messages
  const clearMessages = () => {
    error.value = ''
    success.value = ''
  }

  // Auto-clear des messages
  const autoClearMessages = (delay = 3000) => {
    setTimeout(clearMessages, delay)
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    executeAction,
    deleteAction,
    logoutAction,
    clearMessages,
    autoClearMessages
  }
}

// Composable spécialisé pour les actions de profil
export const useProfilActions = () => {
  const { deleteProfil, selectProfil } = useProfils()
  const authStore = useAuthStore()
  const { deleteAction, logoutAction, executeAction } = useActions()

  // Supprimer un profil
  const handleDeleteProfil = async (profilId: number, profilName: string) => {
    return deleteAction(() => deleteProfil(profilId), `le profil "${profilName}"`)
  }

  // Sélectionner un profil
  const handleSelectProfil = async (profil: any) => {
    return executeAction(
      () => selectProfil(profil),
      {
        successMessage: `Profil "${profil.nom}" activé`,
        errorMessage: 'Erreur lors de la sélection du profil'
      }
    )
  }

  // Déconnexion
  const handleLogout = async () => {
    const { resetStore } = useProfils()
    return logoutAction(async () => {
      await authStore.logout()
      resetStore()
    })
  }

  return {
    handleDeleteProfil,
    handleSelectProfil,
    handleLogout
  }
} 