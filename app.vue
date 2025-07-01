<template>
  <div>
    <main class="main-content">
      <NuxtPage />
    </main>
    <MobileNav />
    
    <!-- Onboarding Modal -->
    <OnboardingModal />
  </div>
</template>

<script setup lang="ts">
const onboardingStore = useOnboardingStore()

// Initialiser l'onboarding au montage de l'app
onMounted(() => {
  // Vérifier le statut de l'onboarding
  onboardingStore.checkOnboardingStatus()
  
  // Si l'utilisateur n'a jamais vu l'onboarding, l'afficher après un délai
  if (!onboardingStore.hasSeenOnboarding) {
    setTimeout(() => {
      onboardingStore.showOnboarding()
    }, 1500) // Délai pour laisser l'app se charger proprement
  }
})
</script>

<style>
.main-content {
  /* Espace pour navigation mobile en bas */
  padding-bottom: 80px;
}

/* Sur desktop, espace pour navigation en haut */
@media (min-width: 768px) {
  .main-content {
    padding-bottom: 0;
    padding-top: 64px; /* Hauteur de la nav desktop */
  }
}
</style>
