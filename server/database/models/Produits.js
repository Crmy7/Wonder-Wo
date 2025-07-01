// import { DataTypes } from 'sequelize';
// import sequelize from '../config.js';

//   const Produit = sequelize.define('Produit', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     Image_url: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Nom_Commun: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Nom_Scientifique: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Famille_Botanique: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Partie_Plante: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Composition: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     Forme_Galenique: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Propriete_Principale: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Propriete_Secondaire: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     Utilisation: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     Precautions: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     Source: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     IdRecette: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Recettes',
//         key: 'id'
//       }
//     },
//     IdMaux: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Maux',
//         key: 'id'
//       }
//     }
//   }, {
//     tableName: 'Produits',
//     timestamps: true
//   });

// export default Produit; 
