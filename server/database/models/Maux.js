import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

 const Maux = sequelize.define('Maux', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Symptom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // IdProduit: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Produits',
    //     key: 'id'
    //   },
    // },
    // IdRecettes: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'Recettes',
    //     key: 'id'
    //   },
    // },
  }, {
    tableName: 'Maux',
    timestamps: true
  });

  export default Maux;
  