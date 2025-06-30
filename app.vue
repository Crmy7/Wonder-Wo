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
  padding-bottom: 80px; /* Espace pour la navigation mobile */
}

/* Sur desktop, pas besoin de padding */
@media (min-width: 768px) {
  .main-content {
    padding-bottom: 0;
  }
}
</style>
