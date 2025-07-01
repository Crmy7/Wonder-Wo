import type { Ref } from 'vue'

export interface FormState {
  loading: boolean
  error: string
  success: string
}

export const useForm = <T extends Record<string, any>>(
  initialData: T,
  submitFn?: (data: T) => Promise<any>
) => {
  // État du formulaire
  const formData = reactive<T>({ ...initialData })
  const formState = reactive<FormState>({
    loading: false,
    error: '',
    success: ''
  })

  // Réinitialiser le formulaire
  const reset = () => {
    Object.assign(formData, { ...initialData })
    clearMessages()
  }

  // Effacer les messages
  const clearMessages = () => {
    formState.error = ''
    formState.success = ''
  }

  // Définir un message d'erreur
  const setError = (error: string) => {
    formState.error = error
    formState.success = ''
  }

  // Définir un message de succès
  const setSuccess = (success: string) => {
    formState.success = success
    formState.error = ''
  }

  // Soumettre le formulaire
  const submit = async (customSubmitFn?: (data: T) => Promise<any>) => {
    const submitFunction = customSubmitFn || submitFn
    
    if (!submitFunction) {
      throw new Error('Aucune fonction de soumission fournie')
    }

    formState.loading = true
    clearMessages()

    try {
      const result = await submitFunction(toRaw(formData))
      
      if (result?.message) {
        setSuccess(result.message)
      }
      
      return result
    } catch (error: any) {
      console.error('Erreur formulaire:', error)
      setError(error.statusMessage || error.message || 'Erreur lors de la soumission')
      throw error
    } finally {
      formState.loading = false
    }
  }

  // Validation basique
  const validate = (rules: Record<keyof T, (value: any) => string | null>) => {
    clearMessages()
    
    for (const [field, rule] of Object.entries(rules)) {
      const error = rule(formData[field as keyof T])
      if (error) {
        setError(error)
        return false
      }
    }
    
    return true
  }

  // Auto-clear des messages après un délai
  const autoClearMessages = (delay = 3000) => {
    setTimeout(() => {
      clearMessages()
    }, delay)
  }

  return {
    // État
    formData,
    loading: readonly(toRef(formState, 'loading')),
    error: readonly(toRef(formState, 'error')),
    success: readonly(toRef(formState, 'success')),
    
    // Actions
    reset,
    clearMessages,
    setError,
    setSuccess,
    submit,
    validate,
    autoClearMessages
  }
}

// Composable spécialisé pour les formulaires de profil
export const useProfilForm = () => {
  const { createProfil } = useProfils()
  
  const initialData = {
    nom: '',
    age: 0,
    grossesse: false,
    enfants: false
  }

  const { 
    formData, 
    loading, 
    error, 
    success, 
    reset, 
    submit, 
    validate, 
    setSuccess,
    autoClearMessages
  } = useForm(initialData, createProfil)

  // Validation spécifique aux profils
  const validateProfil = () => {
    return validate({
      nom: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Le nom est requis'
        }
        if (value.trim().length < 2) {
          return 'Le nom doit contenir au moins 2 caractères'
        }
        return null
      },
      age: (value) => {
        const age = Number(value)
        if (isNaN(age) || age < 0) {
          return 'L\'âge doit être un nombre positif'
        }
        if (age > 120) {
          return 'L\'âge ne peut pas dépasser 120 ans'
        }
        return null
      }
    })
  }

  // Soumission avec validation
  const submitProfil = async () => {
    if (!validateProfil()) {
      return false
    }

    try {
      const result = await submit()
      setSuccess('Profil créé avec succès !')
      autoClearMessages(2000)
      return result
    } catch (error) {
      return false
    }
  }

  return {
    // Données du formulaire
    profilData: formData,
    
    // État
    loading,
    error,
    success,
    
    // Actions
    reset,
    submitProfil,
    validateProfil
  }
} 