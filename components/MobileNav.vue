<template>
  <!-- Navigation Desktop -->
  <nav
    v-if="authStore.isLoggedIn"
    class="hidden md:block fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md bg-[var(--color-blanc)] border-[rgba(33,31,28,0.1)]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-primary">
            Wonder Wo
          </NuxtLink>
        </div>

        <!-- Navigation centrale -->
        <div class="flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--color-grey-black)] hover:bg-beige transition-all duration-200"
            :class="{
              'bg-beige text-[var(--color-primary)]': $route.path === '/',
            }"
          >
            <img src="/img/Home_WW.svg" alt="Accueil" class="w-5 h-5" />
            <span class="font-medium">Accueil</span>
          </NuxtLink>

          <template v-if="authStore.isLoggedIn">
            <NuxtLink
              to="/profil"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--color-grey-black)] hover:bg-beige transition-all duration-200"
              :class="{
                'bg-beige text-[var(--color-primary)]':
                  $route.path === '/profil',
              }"
            >
              <img src="/img/Account_WW.svg" alt="Profil" class="w-5 h-5" />
              <span class="font-medium">Profils</span>
            </NuxtLink>

            <NuxtLink
              to="/maux"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--color-grey-black)] hover:bg-beige transition-all duration-200"
              :class="{
                'bg-beige text-[var(--color-primary)]': $route.path === '/maux',
              }"
            >
              <img src="/img/Symptomes_WW.svg" alt="Maux" class="w-5 h-5" />
              <span class="font-medium">Maux</span>
            </NuxtLink>

            <NuxtLink
              to="/library"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--color-grey-black)] hover:bg-beige transition-all duration-200"
              :class="{
                'bg-beige text-[var(--color-primary)]':
                  $route.path === '/library',
              }"
            >
              <img
                src="/img/Produit_WW.svg"
                alt="Bibliothèque"
                class="w-5 h-5"
              />
              <span class="font-medium">Bibliothèque</span>
            </NuxtLink>

            <NuxtLink
              to="/placard"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--color-grey-black)] hover:bg-beige transition-all duration-200"
              :class="{
                'bg-beige text-[var(--color-primary)]':
                  $route.path === '/placard',
              }"
            >
              <img src="/img/Placard_WW.svg" alt="Placard" class="w-5 h-5" />
              <span class="font-medium">Placard</span>
            </NuxtLink>
          </template>
        </div>

        <!-- Actions droite -->
        <div class="flex items-center space-x-4">
          <!-- Switch de profil (si connecté et profils existent) -->
          <div v-if="authStore.isLoggedIn && hasProfiles" class="relative">
            <button
              @click="toggleMenu('profilSwitch')"
              class="flex items-center space-x-2 px-3 py-2 bg-beige rounded-lg hover:bg-primary/10 transition-all duration-200"
            >
              <div
                class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-bold text-primary">{{
                  currentProfil?.nom?.charAt(0) || "P"
                }}</span>
              </div>
              <span class="font-medium text-grey-black">{{
                currentProfil?.nom || "Sélectionner un profil"
              }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': isMenuOpen('profilSwitch') }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- Dropdown profils -->
            <div
              v-if="isMenuOpen('profilSwitch')"
              class="absolute top-full right-0 mt-1 w-64 bg-[var(--color-blanc)] rounded-xl shadow-lg border border-beige overflow-hidden animate-slideDown"
            >
              <div class="p-3 border-b border-beige">
                <p class="text-sm font-medium text-grey-black">
                  Changer de profil
                </p>
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="profil in profils"
                  :key="profil.id"
                  @click="selectProfil(profil)"
                  class="flex items-center space-x-3 px-3 py-3 hover:bg-beige cursor-pointer transition-colors"
                  :class="{ 'bg-beige': currentProfil?.id === profil.id }"
                >
                  <div
                    class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-bold text-primary">{{
                      profil.nom.charAt(0)
                    }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-grey-black">{{ profil.nom }}</p>
                    <p class="text-xs text-grey-black/60">
                      {{ profil.age }} ans
                    </p>
                  </div>
                  <div
                    v-if="currentProfil?.id === profil.id"
                    class="text-primary"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="border-t border-beige">
                <NuxtLink
                  to="/profil"
                  @click="closeAllMenus"
                  class="block px-3 py-3 text-sm accent-text hover:bg-beige transition-colors"
                >
                  Gérer les profils
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Actions auth -->
          <template v-if="!authStore.isLoggedIn">
            <NuxtLink to="/login" class="secondary-btn">
              Se connecter
            </NuxtLink>
            <NuxtLink to="/register" class="primary-btn"> S'inscrire </NuxtLink>
          </template>

          <template v-else>
            <div class="relative">
              <button
                @click="toggleMenu('userMenu')"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-beige transition-all duration-200"
              >
                <img src="/img/Menu_WW.svg" alt="Menu" class="w-5 h-5" />
              </button>

              <!-- Menu utilisateur -->
              <div
                v-if="isMenuOpen('userMenu')"
                class="absolute top-full right-0 mt-1 w-48 bg-[var(--color-blanc)] rounded-xl shadow-lg border border-beige overflow-hidden animate-slideDown"
              >
                <NuxtLink
                  to="/profil"
                  @click="closeAllMenus"
                  class="block px-4 py-3 text-sm hover:bg-beige transition-colors"
                >
                  <span class="accent-text">Mes profils</span>
                </NuxtLink>
                <div
                  @click="closeAllMenus"
                  class="block px-4 py-3 text-sm border-t border-beige hover:bg-beige transition-colors cursor-pointer"
                >
                  <span class="accent-text">Paramètres</span>
                </div>
                <div
                  @click="handleLogout"
                  class="block px-4 py-3 text-sm border-t border-beige hover:bg-beige transition-colors cursor-pointer"
                >
                  <span class="accent-text text-secondary">Se déconnecter</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <!-- Navigation Mobile -->
  <nav
    v-if="authStore.isLoggedIn"
    class="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md bg-[var(--color-blanc)] border-[rgba(33,31,28,0.1)] md:hidden"
  >
    <div class="flex justify-around items-center px-2 py-3 max-w-full">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
        :class="{
          'bg-beige text-[var(--color-primary)] opacity-100':
            $route.path === '/',
        }"
      >
        <div
          class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
          :class="{ 'scale-110': $route.path === '/' }"
        >
          <img src="/img/Home_WW.svg" alt="Accueil" class="w-6 h-6" />
        </div>
        <span class="text-xs font-medium font-hashtag truncate">Accueil</span>
      </NuxtLink>

      <!-- Navigation adaptative selon l'état d'auth -->
      <template v-if="authStore.isLoggedIn">
        <NuxtLink
          to="/maux"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/maux',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{ 'scale-110': $route.path === '/maux' }"
          >
            <img src="/img/Symptomes_WW.svg" alt="Maux" class="w-6 h-6" />
          </div>
          <span class="text-xs font-medium font-hashtag truncate">Maux</span>
        </NuxtLink>

        <NuxtLink
          to="/library"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/library',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{ 'scale-110': $route.path === '/library' }"
          >
            <img src="/img/Produit_WW.svg" alt="Bibliothèque" class="w-6 h-6" />
          </div>
          <span class="text-xs font-medium font-hashtag truncate"
            >Bibliothèque</span
          >
        </NuxtLink>

        <NuxtLink
          to="/placard"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/placard',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{ 'scale-110': $route.path === '/placard' }"
          >
            <img src="/img/Placard_WW.svg" alt="Placard" class="w-6 h-6" />
          </div>
          <span class="text-xs font-medium font-hashtag truncate"
            >Placard</span
          >
        </NuxtLink>

        <NuxtLink
          to="/profil"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/profil',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{ 'scale-110': $route.path === '/profil' }"
          >
            <img src="/img/Account_WW.svg" alt="Profil" class="w-6 h-6" />
          </div>
          <span class="text-xs font-medium font-hashtag truncate">Profils</span>
        </NuxtLink>
      </template>

      <template v-else>
        <NuxtLink
          to="/login"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/login' || $route.path === '/register',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{
              'scale-110':
                $route.path === '/login' || $route.path === '/register',
            }"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                points="16,17 21,12 16,7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="text-xs font-medium font-hashtag truncate"
            >Connexion</span
          >
        </NuxtLink>

        <NuxtLink
          to="/register"
          class="flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200"
          :class="{
            'bg-beige text-[var(--color-primary)] opacity-100':
              $route.path === '/register',
          }"
        >
          <div
            class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
            :class="{ 'scale-110': $route.path === '/register' }"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="8.5"
                cy="7"
                r="4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="20"
                y1="8"
                x2="20"
                y2="14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="23"
                y1="11"
                x2="17"
                y2="11"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="text-xs font-medium font-hashtag truncate"
            >S'inscrire</span
          >
        </NuxtLink>
      </template>

      <div
        class="hidden flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-xl text-[var(--color-grey-black)] opacity-60 hover:bg-beige hover:opacity-80 transition-all duration-200 cursor-pointer"
        @click="toggleMobileMore"
      >
        <div
          class="flex items-center justify-center mb-1 w-6 h-6 transition-transform"
        >
          <img src="/img/Menu_WW.svg" alt="Menu" class="w-6 h-6" />
        </div>
        <span class="text-xs font-medium font-hashtag truncate">Plus</span>
      </div>
    </div>

    <!-- Menu Plus Mobile -->
    <div v-if="isMenuOpen('mobileMore')" class="fixed inset-0 z-40">
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="closeAllMenus"
      ></div>
      <div
        class="absolute bottom-20 right-4 bg-[var(--color-blanc)] rounded-xl shadow-lg overflow-hidden min-w-[160px] animate-slideUp"
      >
        <!-- Switch profil mobile -->
        <template v-if="authStore.isLoggedIn && hasProfiles">
          <div class="px-4 py-3 border-b border-beige">
            <p class="text-xs font-medium text-grey-black mb-2">
              Profil actuel
            </p>
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <span class="text-xs font-bold text-primary">{{
                  currentProfil?.nom?.charAt(0) || "P"
                }}</span>
              </div>
              <span class="text-sm font-medium">{{
                currentProfil?.nom || "Aucun profil"
              }}</span>
            </div>
          </div>

          <div
            @click="toggleMobileProfilSwitch"
            class="block px-4 py-3 text-sm border-b border-beige hover:bg-beige transition-colors cursor-pointer"
          >
            <span class="accent-text">Changer de profil</span>
          </div>

          <!-- Liste profils mobile -->
          <div
            v-if="isMenuOpen('mobileProfilSwitch')"
            class="border-b border-beige"
          >
            <div
              v-for="profil in profils"
              :key="profil.id"
              @click="selectProfil(profil)"
              class="flex items-center space-x-2 px-6 py-2 hover:bg-beige cursor-pointer"
              :class="{ 'bg-beige': currentProfil?.id === profil.id }"
            >
              <div
                class="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <span class="text-xs font-bold text-primary">{{
                  profil.nom.charAt(0)
                }}</span>
              </div>
              <span class="text-sm">{{ profil.nom }}</span>
            </div>
          </div>
        </template>

        <!-- Si non connecté -->
        <template v-if="!authStore.isLoggedIn">
          <NuxtLink
            to="/register"
            @click="closeAllMenus"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-beige transition-colors cursor-pointer"
          >
            <span class="accent-text">S'inscrire</span>
          </NuxtLink>
          <NuxtLink
            to="/login"
            @click="closeAllMenus"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-beige transition-colors cursor-pointer"
          >
            <span class="accent-text">Se connecter</span>
          </NuxtLink>
        </template>

        <!-- Si connecté -->
        <template v-else>
          <div
            @click="closeAllMenus"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-beige transition-colors cursor-pointer"
          >
            <span class="accent-text">Paramètres</span>
          </div>
          <div
            @click="handleLogout"
            class="block px-4 py-3 text-sm border-b border-gray-100 hover:bg-beige transition-colors cursor-pointer"
          >
            <span class="accent-text text-secondary">Se déconnecter</span>
          </div>
        </template>

        <!-- Option commune -->
        <div
          @click="closeAllMenus"
          class="block px-4 py-3 text-sm hover:bg-beige transition-colors cursor-pointer"
        >
          <span class="accent-text">Aide</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, watch } from "vue";

// Composables
const authStore = useAuthStore();
const { profils, currentProfil, hasProfiles, initProfils, resetStore } =
  useProfils();

const { handleSelectProfil, handleLogout } = useProfilActions();

const {
  menus,
  toggle: toggleMenu,
  closeAll: closeAllMenus,
  isOpen: isMenuOpen,
  setupClickOutside,
} = useMultipleMenus();

// Les états des menus sont maintenant gérés par useMultipleMenus

// Setup fermeture au clic extérieur
setupClickOutside();

// Actions simplifiées
const selectProfil = async (profil) => {
  await handleSelectProfil(profil);
  closeAllMenus();
};

const toggleMobileMore = () => {
  toggleMenu("mobileMore");
};

const toggleMobileProfilSwitch = () => {
  toggleMenu("mobileProfilSwitch");
};

// Lifecycle et watchers
onMounted(() => {
  // Charger les profils si connecté
  if (authStore.isLoggedIn) {
    initProfils();
  }

  // Observer les changements d'auth
  watch(
    () => authStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        initProfils();
      } else {
        resetStore();
        closeAllMenus();
      }
    }
  );
});
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.2s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
</style>
