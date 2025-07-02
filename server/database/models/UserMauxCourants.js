import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const UserMauxCourants = sequelize.define('UserMauxCourants', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    IdUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    IdMal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Maux',
            key: 'id'
        }
    },
    frequence: {
        type: DataTypes.ENUM('rare', 'occasionnel', 'frequent', 'chronique'),
        defaultValue: 'occasionnel',
        comment: 'Fréquence du mal pour cet utilisateur'
    },
    priorite: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 5
        },
        comment: 'Priorité du mal pour l\'utilisateur (1-5)'
    }
}, {
    tableName: 'user_maux_courants',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['IdUser', 'IdMal']
        },
        {
            fields: ['IdUser']
        },
        {
            fields: ['priorite']
        }
    ]
});

export default UserMauxCourants; 