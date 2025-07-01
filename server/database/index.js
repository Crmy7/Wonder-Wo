import sequelize from './config.js';
import User from './models/User.js';
import Profil from './models/Profil.js';
import Placard from './models/Placard.js';
import Recettes from './models/Recettes.js';
import Maux from './models/Maux.js';
import Produit from './models/Produits.js';


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

// // Relation Produit / Recette
// Produit.hasMany(Recettes, {
//   foreignKey: 'IdProduit',
//   as: 'recettes'
// });

// Recettes.belongsTo(Produit, {
//   foreignKey: 'IdProduit',
//   as: 'produit'
// });

// // Relation Produit / Maux
// Produit.hasMany(Maux, {
//   foreignKey: 'IdProduit',
//   as: 'maux'
// });
// Maux.belongsTo(Produit, {
//   foreignKey: 'IdProduit',
//   as: 'produit'
// });

// // Relation Recette / Maux
// Maux.hasMany(Recettes, {
//   foreignKey: 'IdMaux',
//   as: 'recettes'
// });
// Recettes.belongsTo(Maux, {
//   foreignKey: 'IdMaux',
//   as: 'maux'
// });

// // Relation Users / Placard (1:1)
// User.hasOne(Placard, {
//   foreignKey: 'IdUser',
//   as: 'placard'
// });
// Placard.belongsTo(User, {
//   foreignKey: 'IdUser',
//   as: 'user'
// });

// // Relation Placard / Produit (plusieurs produits dans le placard)
// Produit.hasMany(Placard, {
//   foreignKey: 'IdProduit',
//   as: 'placements'
// });
// Placard.belongsTo(Produit, {
//   foreignKey: 'IdProduit',
//   as: 'produits'
// });


//Relation 

// Synchronisation de la base conditionnelle
if (process.env.DB_HOST && process.env.DB_NAME) {
    sequelize.sync()
        .then(() => console.log('✅ Tables synchronisées'))
        .catch(err => console.log('⚠️  MySQL non disponible:', err.message));
} else {
    console.log('⚠️  Configuration MySQL manquante - synchronisation ignorée');
}

export { sequelize, User, Profil, Placard, Recettes, Maux, Produit };

