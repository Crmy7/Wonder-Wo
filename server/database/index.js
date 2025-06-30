import sequelize from './config.js';
import User from './models/User.js';
import Profil from './models/Profil.js';

// Relations entre les modèles
User.hasMany(Profil, { 
    foreignKey: 'userId', 
    as: 'profils',
    onDelete: 'CASCADE'
});

Profil.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'user' 
});

// Synchronisation de la base conditionnelle
if (process.env.DB_HOST && process.env.DB_NAME) {
    sequelize.sync()
        .then(() => console.log('✅ Tables synchronisées'))
        .catch(err => console.log('⚠️  MySQL non disponible:', err.message));
} else {
    console.log('⚠️  Configuration MySQL manquante - synchronisation ignorée');
}

export { sequelize, User, Profil }; 