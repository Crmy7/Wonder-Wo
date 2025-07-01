import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Profil = sequelize.define('Profil', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    IdUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 120
        }
    },
    grossesse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    enfants: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'profils',
    timestamps: true
});

export default Profil; 