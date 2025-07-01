export const useMenu = (initialState = false) => {
  const isOpen = ref(initialState)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  // Fermer au clic extérieur
  const setupClickOutside = (selector = '.relative') => {
    if (!process.client) return

    const handleClickOutside = (event: Event) => {
      if (!(event.target as Element).closest(selector)) {
        close()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }

  // Fermer avec la touche Escape
  const setupEscapeKey = () => {
    if (!process.client) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
    open,
    close,
    setupClickOutside,
    setupEscapeKey
  }
}

// Composable spécialisé pour les menus multiples
export const useMultipleMenus = () => {
  const menus = reactive<Record<string, boolean>>({})

  const toggle = (menuName: string) => {
    // Fermer tous les autres menus
    Object.keys(menus).forEach(key => {
      if (key !== menuName) {
        menus[key] = false
      }
    })
    // Toggle le menu demandé
    menus[menuName] = !menus[menuName]
  }

  const open = (menuName: string) => {
    menus[menuName] = true
  }

  const close = (menuName: string) => {
    menus[menuName] = false
  }

  const closeAll = () => {
    Object.keys(menus).forEach(key => {
      menus[key] = false
    })
  }

  const isOpen = (menuName: string) => {
    return !!menus[menuName]
  }

  // Setup pour fermer au clic extérieur
  const setupClickOutside = (selector = '.relative') => {
    if (!process.client) return

    const handleClickOutside = (event: Event) => {
      if (!(event.target as Element).closest(selector)) {
        closeAll()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }

  return {
    menus: readonly(menus),
    toggle,
    open,
    close,
    closeAll,
    isOpen,
    setupClickOutside
  }
} 