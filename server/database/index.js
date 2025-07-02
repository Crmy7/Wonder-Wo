import sequelize from './config.js';
import User from './models/User.js';
import Profil from './models/Profil.js';
import Produit from './models/Produits.js';
import Recettes from './models/Recettes.js';
import Maux from './models/Maux.js';
import Placard from './models/Placard.js';
import UserMauxCourants from './models/UserMauxCourants.js';

// Relations entre les modèles
User.hasMany(Profil, { 
    foreignKey: 'IdUser', 
    as: 'profils',
    onDelete: 'CASCADE'
});

Profil.belongsTo(User, { 
    foreignKey: 'IdUser', 
    as: 'user' 
});

// ——————————————
// Produit ↔ Recette
// ——————————————
Produit.belongsToMany(Recettes, {
  through: 'RecetteProduit',
  foreignKey: 'ProduitId',
  otherKey:  'RecetteId',
  as:        'recettes'
});
Recettes.belongsToMany(Produit, {
  through: 'RecetteProduit',
  foreignKey: 'RecetteId',
  otherKey:  'ProduitId',
  as:        'produits'
});

// ——————————————
// Produit ↔ Maux
// ——————————————
Produit.belongsToMany(Maux, {
  through: 'ProduitMaux',
  foreignKey: 'ProduitId',
  otherKey:  'MauxId',
  as:        'maux'
});
Maux.belongsToMany(Produit, {
  through: 'ProduitMaux',
  foreignKey: 'MauxId',
  otherKey:  'ProduitId',
  as:        'produits'
});

// ——————————————
// Recettes ↔ Maux
// ——————————————
Recettes.belongsToMany(Maux, {
  through: 'RecetteMaux',
  foreignKey: 'RecetteId',
  otherKey:  'MauxId',
  as:        'maux'
});
Maux.belongsToMany(Recettes, {
  through: 'RecetteMaux',
  foreignKey: 'MauxId',
  otherKey:  'RecetteId',
  as:        'recettes'
});

// ——————————————
// Users ↔ Produits (via Placard)
// ——————————————
User.belongsToMany(Produit, {
  through: Placard,     // ou 'Placard' si vous préférez la chaîne
  foreignKey: 'IdUser',
  otherKey:  'IdProduit',
  as:        'produits'
});
Produit.belongsToMany(User, {
  through: Placard,
  foreignKey: 'IdProduit',
  otherKey:  'IdUser',
  as:        'users'
});

// ——————————————
// Relations directes Placard
// ——————————————
Placard.belongsTo(User, {
  foreignKey: 'IdUser',
  as: 'user'
});

Placard.belongsTo(Produit, {
  foreignKey: 'IdProduit',
  as: 'produitDetails'
});

User.hasMany(Placard, {
  foreignKey: 'IdUser',
  as: 'placardItems'
});

Produit.hasMany(Placard, {
  foreignKey: 'IdProduit',
  as: 'placardItems'
});

// ——————————————
// Users ↔ Maux (via UserMauxCourants)
// ——————————————
User.belongsToMany(Maux, {
  through: UserMauxCourants,
  foreignKey: 'IdUser',
  otherKey: 'IdMal',
  as: 'mauxCourants'
});

Maux.belongsToMany(User, {
  through: UserMauxCourants,
  foreignKey: 'IdMal',
  otherKey: 'IdUser',
  as: 'users'
});

// ——————————————
// Relations directes UserMauxCourants
// ——————————————
UserMauxCourants.belongsTo(User, {
  foreignKey: 'IdUser',
  as: 'user'
});

UserMauxCourants.belongsTo(Maux, {
  foreignKey: 'IdMal',
  as: 'mal'
});

User.hasMany(UserMauxCourants, {
  foreignKey: 'IdUser',
  as: 'mauxCourantsItems'
});

Maux.hasMany(UserMauxCourants, {
  foreignKey: 'IdMal',
  as: 'userItems'
});

// Synchronisation de la base conditionnelle
if (process.env.DB_HOST && process.env.DB_NAME) {
    sequelize.sync()
        .then(() => console.log('✅ Tables synchronisées'))
        .catch(err => console.log('⚠️  MySQL non disponible:', err.message));
} else {
    console.log('⚠️  Configuration MySQL manquante - synchronisation ignorée');
}

export { sequelize, User, Profil, Produit, Recettes, Maux, Placard, UserMauxCourants };