<template>
  <div>
    <main class="main-content">
      <NuxtPage />
    </main>
    <MobileNav />
  </div>
</template>

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
