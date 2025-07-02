<template>
  <div>
    <main class="main-content" :class="{ 'no-nav': !isLoggedIn }">
      <NuxtPage />
    </main>
    <MobileNav />
    
    <!-- Onboarding Modal -->
    <OnboardingModal />
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = useAuthStore()

// Pas d'initialisation automatique de l'onboarding
// Il ne s'affichera que sur choix de l'utilisateur
</script>

<style>
.main-content {
  /* Espace pour navigation mobile en bas par défaut */
  padding-bottom: 80px;
}

/* Si pas connecté, pas de padding pour la nav */
.main-content.no-nav {
  padding-bottom: 0;
}

/* Sur desktop, espace pour navigation en haut si connecté */
@media (min-width: 768px) {
  .main-content {
    padding-bottom: 0;
    padding-top: 64px; /* Hauteur de la nav desktop */
  }
  
  .main-content.no-nav {
    padding-top: 0;
  }
}
</style>
