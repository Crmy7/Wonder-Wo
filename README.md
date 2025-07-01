# Wonder Wo 🌿

Une webapp intuitive pour recommander des remèdes naturels personnalisés basée sur Nuxt 3.

## ✨ Fonctionnalités Implémentées

### 🔐 Système d'Authentification Complet
- ✅ Inscription utilisateur avec validation
- ✅ Connexion sécurisée 
- ✅ Déconnexion
- ✅ JWT via cookies sécurisés
- ✅ Hashage des mots de passe avec bcrypt

### 🗄️ Architecture Base de Données
- ✅ Configuration Sequelize + MySQL
- ✅ Modèles User et Profil
- ✅ Relations et contraintes
- ✅ Initialisation automatique

### 🎨 Interface Utilisateur
- ✅ Design moderne avec TailwindCSS
- ✅ Pages d'inscription et connexion
- ✅ Page d'accueil attrayante
- ✅ Messages d'erreur et de succès
- ✅ Animations et transitions

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- MySQL en cours d'exécution
- npm ou yarn

### Installation

1. **Cloner et installer les dépendances**
```bash
npm install
```

2. **Configuration Base de Données**
Créer un fichier `.env` à la racine :
```env
# Configuration MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=wonder_wo

# JWT Secret
JWT_SECRET=votre-clé-secrète-jwt
```

3. **Créer la base de données**
```sql
CREATE DATABASE wonder_wo;
```

4. **Démarrer le serveur**
```bash
npm run dev
```

## 📱 Utilisation

1. **Page d'accueil** : `http://localhost:3000`
   - Présentation de l'application
   - Liens vers inscription/connexion

2. **Inscription** : `http://localhost:3000/register`
   - Création d'un nouveau compte
   - Validation email/mot de passe
   - Redirection automatique après inscription

3. **Connexion** : `http://localhost:3000/login`
   - Authentification utilisateur
   - Session sécurisée via JWT
   - Redirection vers profil

## 🏗️ Architecture

### Backend (`/server`)
```
server/
├── api/
│   └── auth/
│       ├── register.post.ts    # Inscription
│       ├── login.post.ts       # Connexion
│       └── logout.post.ts      # Déconnexion
├── database/
│   ├── config.ts               # Configuration Sequelize
│   ├── models/
│   │   ├── User.ts             # Modèle utilisateur
│   │   └── Profil.ts           # Modèle profil
│   └── index.ts                # Initialisation DB
└── utils/
    └── auth.ts                 # Utilitaires JWT/bcrypt
```

### Frontend (`/pages`)
```
pages/
├── index.vue                   # Page d'accueil
├── register.vue                # Inscription
├── login.vue                   # Connexion
└── profil.vue                  # Dashboard utilisateur
```

## 🔧 Technologies

- **Frontend** : Nuxt 3 + Vue 3 + TypeScript
- **Styling** : TailwindCSS 4
- **Backend** : Nitro (intégré Nuxt)
- **Base de Données** : MySQL + Sequelize ORM
- **Authentification** : JWT + bcrypt
- **Validation** : Validation native + côté serveur

## 📋 Prochaines Étapes

D'après le backlog, les prochaines fonctionnalités à implémenter :

### Jour 2 : Moteur IA et Placard
- [ ] Routes API pour le placard virtuel
- [ ] Intégration OpenAI pour les recommandations
- [ ] Pages frontend correspondantes

### Jour 3 : Bibliothèque
- [ ] Base de données des produits naturels
- [ ] Interface de consultation
- [ ] Système de recherche

### Jour 4 : Finitions
- [ ] Middleware d'authentification
- [ ] Tests utilisateur
- [ ] Déploiement production

## 🎯 État Actuel

✅ **TERMINÉ** : Système d'authentification complet et fonctionnel  
🚧 **EN COURS** : Prêt pour l'implémentation des profils et du moteur IA  
⏳ **À VENIR** : Fonctionnalités métier selon planning backlog  

## 📞 Support

Le système d'authentification est maintenant opérationnel ! Vous pouvez tester :
1. L'inscription d'un nouvel utilisateur
2. La connexion avec les identifiants créés
3. La déconnexion sécurisée

Toutes les routes API fonctionnent et les données sont persistées en base de données MySQL.
