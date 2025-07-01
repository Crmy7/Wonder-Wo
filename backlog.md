# Plan Complet du Projet Wonder Wo (Nuxt 3 + Sequelize + MySQL + OpenAI)

## Objectifs MVP
Créer une webapp intuitive pour recommander des remèdes naturels à partir des symptômes, des produits possédés (placard virtuel), et consulter une bibliothèque informative.

---

## Architecture technique

### Stack Technique
- **Frontend** : Nuxt 3 (Composition API, `<script setup>`) + TailwindCSS
- **Backend** : API Nuxt 3 (`/server/api` avec Nitro)
- **ORM** : Sequelize
- **BDD** : MySQL (PlanetScale ou Railway)
- **Authentification** : JWT via cookies sécurisés
- **IA** : OpenAI API

### Structure Base de Données

#### Users
- id (PK)
- email (unique)
- password (bcrypt)

#### Profils
- id (PK)
- IdUser (FK Users)
- nom
- âge
- grossesse (bool)
- enfants (bool)

#### Placards
- id (PK)
- profilId (FK Profils)
- produit
- dateAjout

#### Produits
- id (PK)
- nom
- usages
- formes (JSON)
- précautions
- source

#### Maux
- id (PK)
- symptôme
- produits_suggérés (JSON)

---

## Routes API (`/server/api`)

### Authentification
- POST `/auth/register` → création utilisateur
- POST `/auth/login` → connexion, renvoie JWT

### Profils
- POST `/profil/create` → créer un profil
- GET `/profil/list` → liste des profils d'un utilisateur
- PUT `/profil/update` → modifier un profil existant

### Placard
- POST `/placard/add` → ajouter un produit
- GET `/placard/list` → liste des produits
- DELETE `/placard/delete` → supprimer un produit

### IA (Maux)
- POST `/ia` → reçoit symptôme et retourne recommandations OpenAI

### Produits
- GET `/produits/list` → renvoie liste des produits

---

## Frontend – Pages Nuxt 3

- `/register.vue` : formulaire d'inscription
- `/login.vue` : formulaire de connexion
- `/profil.vue` : création, modification et sélection des profils
- `/maux.vue` : saisie symptôme → recommandation IA
- `/bibliotheque.vue` : consultation fiches produits
- `/placard.vue` : gestion des produits possédés

---

## Planning détaillé (3-4 jours)

### Jour 1 : Authentification et Gestion Profils

#### Backend
- Configurer Sequelize & créer tables Users, Profils
- Implémenter routes auth et profil

#### Frontend
- Créer pages `/register`, `/login`, `/profil`

### Jour 2 : Moteur IA et Gestion Placard

#### Backend
- Implémenter routes placard
- Route IA avec prompt enrichi selon le profil

#### Frontend
- Créer pages `/maux`, `/placard`

### Jour 3 : Bibliothèque

#### Backend
- Préparer données mockées ou import Excel simplifié
- Implémenter route produits

#### Frontend
- Créer page `/bibliotheque`

### Jour 4 : Finitions & Déploiement

- Middleware `auth` pour sécuriser toutes les routes
- UI responsive et amélioration UX
- Test intégral utilisateur
- Déploiement (Vercel, PlanetScale)
- Préparation pitch et démonstration

---

## Exemple de Prompt IA (pour route `/ia`)

```text
Je suis une femme de 35 ans, enceinte. Je ressens du stress. Quels remèdes naturels simples et sûrs puis-je utiliser ? Indique clairement le produit, son utilisation et les précautions éventuelles."
```

---

Ce document constitue un guide complet pour développer efficacement le MVP Wonder Wo en respectant les contraintes techniques et temporelles fournies.

