<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md bg-[var(--color-blanc)] border-[rgba(33,31,28,0.1)] md:hidden"
  >
    <div class="flex justify-around items-center px-2 py-3 max-w-full">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-blanc hover:opacity-80 transition-all duration-200"
        :class="{ 'bg-blanc text-[var(--color-primary)] opacity-100': $route.path === '/' }"
      >
        <div class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
             :class="{ 'scale-110': $route.path === '/' }">
          <img src="/img/Home_WW.svg" alt="Accueil" class="w-6 h-6">
        </div>
        <span class="text-xs font-medium font-hashtag truncate">Accueil</span>
      </NuxtLink>

      <NuxtLink
        to="/profil"
        class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-blanc hover:opacity-80 transition-all duration-200"
        :class="{ 'bg-blanc text-[var(--color-primary)] opacity-100': $route.path === '/profil' }"
      >
        <div class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
             :class="{ 'scale-110': $route.path === '/profil' }">
          <img src="/img/Account_WW.svg" alt="Profil" class="w-6 h-6">
        </div>
        <span class="text-xs font-medium font-hashtag truncate">Profil</span>
      </NuxtLink>

      <NuxtLink
        to="/login"
        class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-blanc hover:opacity-80 transition-all duration-200"
        :class="{ 'bg-blanc text-[var(--color-primary)] opacity-100': $route.path === '/login' || $route.path === '/register' }"
      >
        <div class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
             :class="{ 'scale-110': $route.path === '/login' || $route.path === '/register' }">
          <!-- Icon Connexion -->
        </div>
        <span class="text-xs font-medium font-hashtag truncate">Connexion</span>
      </NuxtLink>

      <div
        class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-blanc hover:opacity-80 transition-all duration-200 cursor-pointer"
        @click="toggleMore"
      >
                 <div class="flex items-center justify-center mb-1 w-6 h-6 transition-transform">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
         </div>
        <span class="text-xs font-medium font-hashtag truncate">Plus</span>
      </div>
    </div>

    <!-- Menu Plus -->
    <div v-if="showMore" class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showMore = false"></div>
      <div
        class="absolute bottom-20 right-4 bg-[var(--color-blanc)] rounded-xl shadow-lg overflow-hidden min-w-[160px] animate-slideUp"
      >
        <!-- Si non connecté -->
        <template v-if="!authStore.isLoggedIn">
          <NuxtLink to="/register" @click="showMore = false"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-blanc transition-colors cursor-pointer">
            <span class="accent-text">S'inscrire</span>
          </NuxtLink>
          <NuxtLink to="/login" @click="showMore = false"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-blanc transition-colors cursor-pointer">
            <span class="accent-text">Se connecter</span>
          </NuxtLink>
        </template>

        <!-- Si connecté -->
        <template v-else>
          <div @click="showMore = false"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-blanc transition-colors cursor-pointer">
            <span class="accent-text">Paramètres</span>
          </div>
          <div @click="handleLogout"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-blanc transition-colors cursor-pointer">
            <span class="accent-text text-secondary">Se déconnecter</span>
          </div>
        </template>

        <!-- Option commune -->
        <div @click="showMore = false"
          class="block px-4 py-3 text-sm hover:bg-blanc transition-colors cursor-pointer">
          <span class="accent-text">Aide</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const authStore = useAuthStore()
const showMore = ref(false)

const toggleMore = () => {
  showMore.value = !showMore.value
}

const handleLogout = async () => {
  showMore.value = false
  try {
    await authStore.logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Erreur déconnexion:', error)
  }
}
</script>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.2s ease-out;
}
</style>
 