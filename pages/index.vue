<template>
  <!-- Page de bienvenue pour utilisateurs non connectés -->
  <div v-if="!isLoggedIn" class="min-h-screen bg-gradient-to-br from-primary/10 via-blanc to-beige/20">
    <!-- Version Mobile : Fullscreen -->
    <div class="block md:hidden min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <!-- Logo animé -->
      <div class="mb-12">
        <div class="w-28 h-28 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-5xl shadow-xl animate-float">
          🌿
        </div>
      </div>
      
      <!-- Titre principal mobile -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-effloresce text-primary mb-3">
          Wonder Wo
        </h1>
        <h2 class="text-lg font-medium text-secondary mb-4">
          Votre compagnon bien-être naturel
        </h2>
        <p class="text-grey-black/80 leading-relaxed px-4">
          Découvrez des remèdes naturels personnalisés selon votre placard et vos besoins.
        </p>
      </div>

      <!-- Boutons d'action mobile -->
      <div class="w-full max-w-sm space-y-4">
        <button 
          @click="startGuidedOnboarding"
          class="w-full primary-btn py-4 text-lg font-medium"
        >
          ✨ Créer mon compte
        </button>
        <NuxtLink to="/login" class="w-full secondary-btn py-4 text-lg font-medium block text-center">
          🔐 Se connecter
        </NuxtLink>
      </div>

      <!-- Footer info mobile -->
      <div class="text-center text-grey-black/60 text-sm mt-12">
        <p>Rejoignez des milliers d'utilisateurs qui ont choisi le naturel</p>
      </div>
    </div>

    <!-- Version Desktop : Comme avant -->
    <div class="hidden md:block min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <!-- Hero Section -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <!-- Logo animé -->
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl shadow-xl animate-float">
            🌿
          </div>
        </div>
        
        <!-- Titre principal -->
        <h1 class="text-4xl md:text-6xl font-effloresce text-primary mb-4">
          Wonder Wo
        </h1>
        <h2 class="text-xl md:text-2xl font-medium text-secondary mb-6">
          Votre compagnon bien-être naturel
        </h2>
        <p class="text-grey-black/80 text-lg leading-relaxed mb-8">
          Découvrez des remèdes naturels personnalisés selon votre placard virtuel. 
          Créez des profils familiaux et accédez à notre bibliothèque de solutions naturelles validées.
        </p>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="startGuidedOnboarding"
            class="primary-btn px-8 py-4 text-lg font-medium"
          >
            ✨ Commencer l'aventure
          </button>
          <NuxtLink to="/login" class="secondary-btn px-8 py-4 text-lg font-medium">
            🔐 Se connecter
          </NuxtLink>
        </div>
      </div>

      <!-- Aperçu des fonctionnalités -->
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <div class="bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl text-center border border-beige/50">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">🏺</span>
          </div>
          <h3 class="font-effloresce text-lg text-primary mb-2">Placard Intelligent</h3>
          <p class="text-grey-black/70 text-sm">
            Recommandations personnalisées selon vos produits et votre profil
          </p>
        </div>

        <div class="bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl text-center border border-beige/50">
          <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">👨‍👩‍👧‍👦</span>
          </div>
          <h3 class="font-effloresce text-lg text-secondary mb-2">Profils Familiaux</h3>
          <p class="text-grey-black/70 text-sm">
            Gérez les remèdes pour toute votre famille avec leurs spécificités
          </p>
        </div>

        <div class="bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl text-center border border-beige/50">
          <div class="w-16 h-16 bg-beige/60 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📚</span>
          </div>
          <h3 class="font-effloresce text-lg text-primary mb-2">Bibliothèque</h3>
          <p class="text-grey-black/70 text-sm">
            Explorez des milliers de remèdes naturels et traditions ancestrales
          </p>
        </div>
      </div>

      <!-- Footer info -->
      <div class="text-center text-grey-black/60 text-sm">
        <p>Rejoignez des milliers d'utilisateurs qui ont choisi le naturel</p>
      </div>
    </div>
  </div>

  <!-- Contenu principal pour utilisateurs connectés -->
  <div v-else class="min-h-screen bg-blanc overflow-x-hidden">
    <!-- Version Desktop : Landing Page complète -->
    <div class="hidden md:block">
    <!-- Hero Section -->
      <section class="relative py-20 lg:py-32">
        <!-- Background decoratif -->
        <div class="absolute inset-0 bg-gradient-to-br from-beige/20 via-transparent to-primary/10"></div>
        <div class="absolute top-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        
        <div class="relative max-w-6xl mx-auto px-4 text-center">
          <!-- Badge nouveau -->
          <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6" data-aos="fade-in" data-aos-duration="1000">
            <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Nouveau : Recherche personnalisée selon votre placard
          </div>
          
          <!-- Titre principal -->
          <h1 class="text-5xl lg:text-7xl font-effloresce text-primary mb-6 leading-tight" data-aos="fade-in" data-aos-duration="1000">
            Wonder Wo
          </h1>
          <h2 class="text-2xl lg:text-3xl font-effloresce text-grey-black mb-6" data-aos="fade-in" data-aos-duration="1000">
            Votre compagnon bien-être naturel
        </h2>
          
          <!-- Sous-titre -->
          <p class="text-lg lg:text-xl text-grey-black/80 mb-8 max-w-3xl mx-auto leading-relaxed" data-aos="fade-in" data-aos-duration="1000">
            Découvrez des remèdes naturels personnalisés selon votre placard virtuel. 
            Créez des profils familiaux et accédez à notre bibliothèque de solutions naturelles validées.
          </p>
          
          <!-- CTA Buttons -->
          <div v-if="!loading && !isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <NuxtLink to="/register" class="primary-btn text-lg px-8 py-4 font-medium">
              🚀 Commencer l'aventure
            </NuxtLink>
            <NuxtLink to="/login" class="secondary-btn text-lg px-8 py-4 font-medium">
              Se connecter
            </NuxtLink>
          </div>
          
          <div v-else-if="!loading && isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <NuxtLink to="/profil" class="primary-btn text-lg px-8 py-4 font-medium">
              📋 Accéder à mes profils
            </NuxtLink>
            <NuxtLink to="/maux" class="secondary-btn text-lg px-8 py-4 font-medium">
              🔍 Rechercher un remède
            </NuxtLink>
          </div>
          
          <!-- Indicateurs de confiance -->
          <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-grey-black/60">
            <div class="flex items-center gap-2">
              <span class="text-primary">✓</span>
              <span>Placard virtuel intelligent</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-primary">✓</span>
              <span>Remèdes naturels validés</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-primary">✓</span>
              <span>Recherche personnalisée</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-gradient-to-b from-transparent to-beige/30">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-16" data-aos="zoom-in" data-aos-duration="1000">
            <h2 class="text-3xl lg:text-4xl font-effloresce text-primary mb-4">
              Pourquoi choisir Wonder Wo ?
            </h2>
            <p class="text-lg text-grey-black/70 max-w-2xl mx-auto">
              Une approche personnalisée du bien-être naturel basée sur votre placard virtuel
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Feature 1 -->
            <div class="text-center group" data-aos="fade-up" data-aos-duration="1000">
              <div class="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span class="text-4xl">🏺</span>
              </div>
              <h3 class="text-xl font-effloresce text-primary mb-4">Placard Virtuel Intelligent</h3>
              <p class="text-grey-black/70 leading-relaxed">
                Gérez vos produits naturels et recevez des recommandations personnalisées 
                selon ce que vous avez déjà à disposition.
              </p>
            </div>
            
            <!-- Feature 2 -->
            <div class="text-center group" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
              <div class="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span class="text-4xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 class="text-xl font-effloresce text-primary mb-4">Profils Familiaux</h3>
              <p class="text-grey-black/70 leading-relaxed">
                Créez des profils pour chaque membre de votre famille. 
                Recommandations adaptées aux enfants, adultes, femmes enceintes.
              </p>
            </div>
            
            <!-- Feature 3 -->
            <div class="text-center group" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
              <div class="w-20 h-20 bg-gradient-to-br from-beige/60 to-beige/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span class="text-4xl">📚</span>
              </div>
              <h3 class="text-xl font-effloresce text-primary mb-4">Bibliothèque Naturelle</h3>
              <p class="text-grey-black/70 leading-relaxed">
                Accédez à une base complète de remèdes naturels validés 
                avec modes d'emploi et contre-indications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it works Section -->
      <section class="py-20">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-16" data-aos="zoom-in" data-aos-duration="1000">
            <h2 class="text-3xl lg:text-4xl font-effloresce text-primary mb-4">
              Comment ça marche ?
            </h2>
            <p class="text-lg text-grey-black/70">
              3 étapes simples pour optimiser vos remèdes naturels
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Étape 1 -->
            <div class="relative" data-aos="fade-right" data-aos-duration="1000">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary text-blanc rounded-2xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  1
                </div>
                <h3 class="text-lg font-effloresce text-primary mb-3">Remplissez votre placard</h3>
                <p class="text-grey-black/70">
                  Ajoutez vos produits naturels dans votre placard virtuel pour des recommandations optimisées
                </p>
              </div>
              <!-- Flèche décorative -->
              <div class="hidden md:block absolute top-8 -right-6 text-primary/30">
                <svg class="w-12 h-6" fill="currentColor" viewBox="0 0 24 12">
                  <path d="M18 6l-6-6v4H0v4h12v4l6-6z"/>
                </svg>
              </div>
            </div>
            
            <!-- Étape 2 -->
            <div class="relative" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="100">
              <div class="text-center">
                <div class="w-16 h-16 bg-secondary text-blanc rounded-2xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  2
                </div>
                <h3 class="text-lg font-effloresce text-primary mb-3">Décrivez vos maux</h3>
                <p class="text-grey-black/70">
                  Utilisez notre moteur de recherche pour décrire vos symptômes et besoins
                </p>
              </div>
              <!-- Flèche décorative -->
              <div class="hidden md:block absolute top-8 -right-6 text-primary/30">
                <svg class="w-12 h-6" fill="currentColor" viewBox="0 0 24 12">
                  <path d="M18 6l-6-6v4H0v4h12v4l6-6z"/>
                </svg>
              </div>
            </div>
            
            <!-- Étape 3 -->
            <div class="text-center" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
              <div class="w-16 h-16 bg-gradient-to-r from-primary to-secondary text-blanc rounded-2xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                3
              </div>
              <h3 class="text-lg font-effloresce text-primary mb-3">Recevez vos recommandations</h3>
              <p class="text-grey-black/70">
                Obtenez des solutions personnalisées privilégiant ce que vous avez déjà
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo Section -->
      <section class="py-20 bg-gradient-to-br from-primary/5 to-beige/20">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl lg:text-4xl font-effloresce text-primary mb-6" data-aos="zoom-in" data-aos-duration="1000">
            Découvrez Wonder Wo en action
          </h2>
          <p class="text-lg text-grey-black/70 mb-8" data-aos="fade-in" data-aos-duration="1000">
            Explorez nos fonctionnalités et voyez comment optimiser votre bien-être naturel
          </p>
          
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Demo 1 -->
            <NuxtLink to="/maux" class="group bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl border border-beige hover:border-primary/40 transition-all duration-300 hover:scale-105" data-aos="fade-up" data-aos-duration="1000">
              <div class="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🔍</span>
              </div>
              <h3 class="font-effloresce text-primary mb-2">Rechercher un remède</h3>
              <p class="text-sm text-grey-black/70 mb-3">Testez notre moteur de recherche intelligent</p>
              <span class="accent-text text-sm">Essayer →</span>
            </NuxtLink>
            
            <!-- Demo 2 -->
            <NuxtLink to="/library" class="group bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl border border-beige hover:border-primary/40 transition-all duration-300 hover:scale-105" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
              <div class="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📚</span>
              </div>
              <h3 class="font-effloresce text-primary mb-2">Découvrir la bibliothèque</h3>
              <p class="text-sm text-grey-black/70 mb-3">Parcourez nos remèdes naturels</p>
              <span class="accent-text text-sm">Découvrir →</span>
            </NuxtLink>
            
            <!-- Demo 3 -->
            <button @click="showOnboardingAgain" class="group bg-blanc/80 backdrop-blur-sm p-6 rounded-2xl border border-beige hover:border-primary/40 transition-all duration-300 hover:scale-105" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
              <div class="w-12 h-12 bg-gradient-to-br from-beige/60 to-beige/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">✨</span>
              </div>
              <h3 class="font-effloresce text-primary mb-2">Visite guidée</h3>
              <p class="text-sm text-grey-black/70 mb-3">Suivez notre présentation interactive</p>
              <span class="accent-text text-sm">Commencer →</span>
            </button>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-20">
        <div class="max-w-4xl mx-auto px-4 text-center" data-aos="zoom-in" data-aos-duration="1000">
          <div class="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-blanc">
            <h2 class="text-3xl lg:text-4xl font-effloresce mb-6 text-blanc">
              Prêt à optimiser votre bien-être naturel ?
            </h2>
            <p class="text-lg mb-8 text-blanc/90">
              Rejoignez des milliers d'utilisateurs qui utilisent Wonder Wo 
              pour gérer leurs remèdes naturels au quotidien.
            </p>
            
            <div v-if="!loading && !isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/register" class="bg-blanc text-primary px-8 py-4 rounded-xl font-medium hover:bg-blanc/90 transition-colors">
                Créer mon compte
              </NuxtLink>
              <button @click="showOnboardingAgain" class="border-2 border-blanc text-blanc px-8 py-4 rounded-xl font-medium hover:bg-blanc/10 transition-colors">
                Voir la démonstration
              </button>
            </div>
            
            <div v-else-if="isLoggedIn" class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/profil" class="bg-blanc text-primary px-8 py-4 rounded-xl font-medium hover:bg-blanc/90 transition-colors">
                Accéder à mon espace
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 bg-grey-black/5">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center">
            <h3 class="text-2xl font-effloresce text-primary mb-4">Wonder Wo</h3>
            <p class="text-grey-black/60 mb-6">Votre compagnon bien-être naturel</p>
            
            <div class="flex justify-center gap-8 mb-8">
              <button @click="showOnboardingAgain" class="text-grey-black/60 hover:text-primary transition-colors">
                Guide d'utilisation
              </button>
              <NuxtLink to="/library" class="text-grey-black/60 hover:text-primary transition-colors">
                Bibliothèque
              </NuxtLink>
              <NuxtLink to="/maux" class="text-grey-black/60 hover:text-primary transition-colors">
                Recherche
              </NuxtLink>
            </div>
            
            <div class="border-t border-grey-black/10 pt-6">
              <p class="text-sm text-grey-black/40">
                © 2025 Wonder Wo - Votre bien-être naturel
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Version Mobile : Interface App -->
    <div class="block md:hidden">
      <div class="mx-auto px-5 py-6">
        <!-- Header Mobile -->
        <div class="text-center mb-6">
          <h1 class="text-3xl font-effloresce text-primary mb-2">Wonder Wo</h1>
          <p class="accent-text text-lg">Votre bien-être naturel</p>
        </div>

        <!-- Statut utilisateur -->
        <div v-if="!loading && !isLoggedIn" class="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-2xl mb-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-xl">🌿</span>
            </div>
            <h3 class="font-effloresce text-primary mb-2">Bienvenue !</h3>
            <div class="flex gap-2">
              <NuxtLink to="/register" class="primary-btn flex-1 text-sm py-2">
                S'inscrire
              </NuxtLink>
              <NuxtLink to="/login" class="secondary-btn flex-1 text-sm py-2">
                Connexion
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else-if="isLoggedIn" class="bg-primary/5 p-4 rounded-2xl mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span class="text-lg">👋</span>
            </div>
            <div>
              <h3 class="font-medium text-grey-black">Bon retour !</h3>
              <p class="text-sm text-grey-black/60">Que recherchez-vous aujourd'hui ?</p>
            </div>
          </div>
        </div>

        <!-- Raccourcis Maux Courants -->
        <div class="mb-6">
          <h2 class="font-effloresce text-primary text-lg mb-4">
            {{ isLoggedIn ? '🎯 Mes maux courants' : '🎯 Maux courants' }}
          </h2>
          <!-- Maux personnalisés pour utilisateurs connectés -->
          <div v-if="isLoggedIn && userMauxCourants.length > 0" class="grid grid-cols-2 gap-3">
            <button 
              v-for="mal in userMauxCourants.slice(0, 6)" 
              :key="mal.id"
              @click="searchMal(mal.symptom)" 
              class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left"
            >
              <div class="text-2xl mb-2">{{ mal.icon || '🌿' }}</div>
              <h3 class="font-medium text-grey-black text-sm">{{ mal.symptom }}</h3>
              <p class="text-xs text-grey-black/60">{{ mal.category || 'Remède naturel' }}</p>
              <div class="flex items-center gap-1 mt-1">
                <div class="w-1 h-1 bg-primary rounded-full"></div>
                <span class="text-xs text-primary">Priorité {{ mal.priorite }}</span>
              </div>
            </button>
          </div>
          
          <!-- Maux par défaut pour tous les utilisateurs (si pas de maux personnalisés) -->
          <div v-else class="grid grid-cols-2 gap-3">
            <button @click="searchMal('mal de tête')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">🤕</div>
              <h3 class="font-medium text-grey-black text-sm">Mal de tête</h3>
              <p class="text-xs text-grey-black/60">Remèdes naturels</p>
            </button>
            
            <button @click="searchMal('stress')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">😰</div>
              <h3 class="font-medium text-grey-black text-sm">Stress</h3>
              <p class="text-xs text-grey-black/60">Relaxation</p>
            </button>
            
            <button @click="searchMal('insomnie')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">😴</div>
              <h3 class="font-medium text-grey-black text-sm">Insomnie</h3>
              <p class="text-xs text-grey-black/60">Aide au sommeil</p>
            </button>
            
            <button @click="searchMal('rhume')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">🤧</div>
              <h3 class="font-medium text-grey-black text-sm">Rhume</h3>
              <p class="text-xs text-grey-black/60">Immunité</p>
            </button>
            
            <button @click="searchMal('digestion')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">🤢</div>
              <h3 class="font-medium text-grey-black text-sm">Digestion</h3>
              <p class="text-xs text-grey-black/60">Troubles digestifs</p>
            </button>
            
            <button @click="searchMal('fatigue')" class="bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="text-2xl mb-2">😪</div>
              <h3 class="font-medium text-grey-black text-sm">Fatigue</h3>
              <p class="text-xs text-grey-black/60">Boost énergie</p>
            </button>
          </div>
          
          <!-- Bouton pour gérer les maux courants -->
          <div v-if="isLoggedIn" class="mt-4 text-center">
            <button 
              @click="showManageMaux" 
              class="text-xs text-primary hover:text-secondary transition-colors underline"
            >
              {{ userMauxCourants.length > 0 ? 'Modifier mes maux courants' : 'Définir mes maux courants' }}
            </button>
          </div>
        </div>

        <!-- Produits Populaires -->
        <div class="mb-6">
          <h2 class="font-effloresce text-primary text-lg mb-4">🌿 Produits populaires</h2>
          <div class="space-y-3">
            <button @click="searchProduct('miel')" class="w-full bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="flex items-center gap-3">
                <div class="text-2xl">🍯</div>
                <div class="flex-1">
                  <h3 class="font-medium text-grey-black text-sm">Miel</h3>
                  <p class="text-xs text-grey-black/60">Antiseptique naturel, cicatrisant</p>
                </div>
                <span class="accent-text text-xs">→</span>
              </div>
            </button>
            
            <button @click="searchProduct('gingembre')" class="w-full bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="flex items-center gap-3">
                <div class="text-2xl">🫚</div>
                <div class="flex-1">
                  <h3 class="font-medium text-grey-black text-sm">Gingembre</h3>
                  <p class="text-xs text-grey-black/60">Anti-nausée, anti-inflammatoire</p>
                </div>
                <span class="accent-text text-xs">→</span>
              </div>
            </button>
            
            <button @click="searchProduct('camomille')" class="w-full bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="flex items-center gap-3">
                <div class="text-2xl">🌼</div>
                <div class="flex-1">
                  <h3 class="font-medium text-grey-black text-sm">Camomille</h3>
                  <p class="text-xs text-grey-black/60">Calmante, aide au sommeil</p>
                </div>
                <span class="accent-text text-xs">→</span>
              </div>
            </button>
            
            <button @click="searchProduct('aloe vera')" class="w-full bg-blanc p-4 rounded-xl border border-beige hover:border-primary/40 transition-colors text-left">
              <div class="flex items-center gap-3">
                <div class="text-2xl">🌵</div>
                <div class="flex-1">
                  <h3 class="font-medium text-grey-black text-sm">Aloe Vera</h3>
                  <p class="text-xs text-grey-black/60">Hydratant, anti-inflammatoire</p>
                </div>
                <span class="accent-text text-xs">→</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Actions Principales -->
        <div class="mb-8">
          <h2 class="font-effloresce text-primary text-xl mb-6 flex items-center gap-2">
            <span class="text-2xl">🎯</span>
            Actions rapides
          </h2>
          <div class="space-y-4">
            <NuxtLink to="/maux" class="w-full bg-blanc/50 p-6 rounded-2xl hover:bg-blanc/80 transition-colors relative overflow-hidden group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">🤒</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-effloresce text-lg text-grey-black mb-1">Trouver un remède</h3>
                  <p class="text-sm text-grey-black/60">Recherche par symptômes</p>
                </div>
                <span class="font-hashtag text-primary text-lg">Chercher →</span>
              </div>
            </NuxtLink>

            <NuxtLink to="/library" class="w-full bg-blanc/50 p-6 rounded-2xl hover:bg-blanc/80 transition-colors relative overflow-hidden group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">🌿</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-effloresce text-lg text-grey-black mb-1">Découvrir la bibliothèque</h3>
                  <p class="text-sm text-grey-black/60">Bibliothèque naturelle</p>
                </div>
                <span class="font-hashtag text-primary text-lg">Découvrir →</span>
              </div>
            </NuxtLink>

            <NuxtLink to="/profil" class="w-full bg-blanc/50 p-6 rounded-2xl hover:bg-blanc/80 transition-colors relative overflow-hidden group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">👤</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-effloresce text-lg text-grey-black mb-1">Gérer mes profils</h3>
                  <p class="text-sm text-grey-black/60">Profils familiaux</p>
                </div>
                <span class="font-hashtag text-primary text-lg">Accéder →</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Guide et Aide -->
        <div class="bg-gradient-to-r from-primary/5 to-beige/20 p-4 rounded-xl">
          <div class="text-center">
            <h3 class="font-effloresce text-primary mb-2">✨ Première visite ?</h3>
            <p class="text-sm text-grey-black/70 mb-3">Découvrez comment Wonder Wo peut vous aider</p>
            <button @click="showOnboardingAgain" class="primary-btn w-full text-sm">
              🎯 Voir le guide
            </button>
        </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Composables
const { user, isLoggedIn, loading } = useAuthStore()
const onboardingStore = useOnboardingStore()

// État réactif
const showWelcomePage = ref(false)
const userMauxCourants = ref<any[]>([])

// Charger les maux courants de l'utilisateur
const loadUserMauxCourants = async () => {
  if (!isLoggedIn) {
    userMauxCourants.value = []
    return
  }
  
  try {
    // Vérifier s'il y a des maux en attente à traiter
    await processPendingMaux()
    
    const response = await $fetch('/api/user/maux-courants')
    userMauxCourants.value = response.mauxCourants.map((mal: any) => ({
      ...mal,
      icon: getIconForSymptom(mal.symptom),
      category: getCategoryForSymptom(mal.symptom)
    }))
  } catch (error) {
    console.error('Erreur chargement maux courants:', error)
    userMauxCourants.value = []
  }
}

// Traiter les maux en attente depuis localStorage
const processPendingMaux = async () => {
  if (typeof window === 'undefined') return
  
  const pendingMaux = localStorage.getItem('pending-maux-courants')
  if (!pendingMaux) return
  
  try {
    const mauxIds = JSON.parse(pendingMaux)
    if (Array.isArray(mauxIds) && mauxIds.length > 0) {
      console.log('🔄 Traitement des maux en attente:', mauxIds)
      
      await $fetch('/api/user/maux-courants', {
        method: 'POST',
        body: { 
          mauxIds,
          action: 'replace'
        }
      })
      
      console.log('✅ Maux en attente sauvegardés')
      localStorage.removeItem('pending-maux-courants')
    }
  } catch (error) {
    console.error('❌ Erreur traitement maux en attente:', error)
  }
}

// Fonctions utilitaires pour les icônes et catégories
function getIconForSymptom(symptom: string): string {
  const symptomLower = symptom.toLowerCase()
  
  if (symptomLower.includes('stress')) return '😰'
  if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return '😴'
  if (symptomLower.includes('anxiété') || symptomLower.includes('angoisse')) return '😟'
  if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement')) return '😪'
  if (symptomLower.includes('mal de tête') || symptomLower.includes('migraine')) return '🤕'
  if (symptomLower.includes('digestion') || symptomLower.includes('crampes') || symptomLower.includes('ballonnements')) return '🤢'
  if (symptomLower.includes('rhume') || symptomLower.includes('toux') || symptomLower.includes('grippe')) return '🤧'
  if (symptomLower.includes('douleur') || symptomLower.includes('mal')) return '💊'
  if (symptomLower.includes('nausées') || symptomLower.includes('vomissement')) return '🤮'
  if (symptomLower.includes('fièvre')) return '🤒'
  
  return '🌿'
}

function getCategoryForSymptom(symptom: string): string {
  const symptomLower = symptom.toLowerCase()
  
  if (symptomLower.includes('stress') || symptomLower.includes('anxiété')) return 'Mental'
  if (symptomLower.includes('sommeil') || symptomLower.includes('insomnie')) return 'Sommeil'
  if (symptomLower.includes('fatigue') || symptomLower.includes('épuisement')) return 'Énergie'
  if (symptomLower.includes('digestion') || symptomLower.includes('crampes')) return 'Digestif'
  if (symptomLower.includes('rhume') || symptomLower.includes('toux')) return 'Respiratoire'
  if (symptomLower.includes('douleur') || symptomLower.includes('mal de tête')) return 'Douleur'
  
  return 'Général'
}

// Gérer les maux courants
const showManageMaux = () => {
  // Rediriger vers la page profil pour gérer les maux courants
  navigateTo('/profil')
}

// Configuration de la page
definePageMeta({
  layout: false
})

// Fonction pour démarrer l'onboarding guidé
const startGuidedOnboarding = () => {
  onboardingStore.setGuidedMode(true)
  onboardingStore.resetOnboarding()
  onboardingStore.showOnboarding()
}

// Vérifier le statut au montage
onMounted(() => {
  // Plus de vérification automatique de l'onboarding
  // Il ne s'affichera que sur choix de l'utilisateur
  
  // Charger les maux courants si l'utilisateur est connecté
  if (isLoggedIn) {
    loadUserMauxCourants()
  }
})

// Watcher pour recharger les maux quand l'utilisateur se connecte
watch(() => isLoggedIn, (newValue) => {
  if (newValue) {
    loadUserMauxCourants()
  } else {
    userMauxCourants.value = []
  }
})

// Fonction pour afficher l'onboarding manuellement en mode révision
const showOnboardingManual = () => {
  onboardingStore.setGuidedMode(false)
  onboardingStore.showOnboarding()
}

// Fonction pour relancer l'onboarding en mode révision
const showOnboardingAgain = () => {
  onboardingStore.setGuidedMode(false)
  onboardingStore.showOnboarding()
}

// Fonctions pour les raccourcis mobile
const searchMal = (mal: string) => {
  // Naviguer vers /maux avec le terme de recherche
  navigateTo({
    path: '/maux',
    query: { q: mal }
  })
}

const searchProduct = (product: string) => {
  // Naviguer vers /library avec le terme de recherche
  navigateTo({
    path: '/library',
    query: { q: product }
  })
}

// Meta données pour le SEO
useSeoMeta({
  title: 'Wonder Wo - Votre compagnon bien-être naturel',
  ogTitle: 'Wonder Wo - Votre compagnon bien-être naturel',
  description: 'Découvrez des remèdes naturels personnalisés selon votre placard virtuel. Créez des profils familiaux et accédez à notre bibliothèque de solutions naturelles validées.',
  ogDescription: 'Découvrez des remèdes naturels personnalisés selon votre placard virtuel. Créez des profils familiaux et accédez à notre bibliothèque de solutions naturelles validées.',
})
</script>

<style scoped>
/* Animations fluides */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Effet de parallax léger */
.hero-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Améliorations responsive */
@media (max-width: 640px) {
  .text-5xl { font-size: 3rem; }
  .text-7xl { font-size: 4rem; }
}
</style>
