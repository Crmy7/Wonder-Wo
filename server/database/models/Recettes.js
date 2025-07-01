import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Recettes = sequelize.define('Recettes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    Type_Remede:{
      type: DataTypes.INTEGER,
      allowNull: false

    }, 
    
    Type_Application: {
        type: DataTypes.INTEGER,
        allowNull: false

    },
    Recette: {
      type: DataTypes.STRING
    },

    Tranche_age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    Femme_Enceinte: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    Source_Documentaire: {
      type: DataTypes.STRING
    },
    Efficacite:{
       type: DataTypes.INTEGER,
        allowNull: true
    }, 

    IdProduit: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Produits',
        key: 'id'
      }
    },
    IdMaux: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Maux',
        key: 'id'
      }
    }
  }, {
    tableName: 'Recettes',
    timestamps: true
  });

  export default Recettes;
