import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Comments = sequelize.define('Comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Type d'entité commentée (produit ou recette)
  entity_type: {
    type: DataTypes.ENUM('produit', 'recette'),
    allowNull: false
  },
  
  // ID de l'entité commentée
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  // ID de l'utilisateur qui a fait le commentaire
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  
  // Contenu du commentaire
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  
  // Note (1-5 étoiles) - optionnelle
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  
  // Statut du commentaire (pour modération)
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
    allowNull: false
  }
  
}, {
  tableName: 'Comments',
  timestamps: true,
  indexes: [
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['user_id']
    }
  ]
});

export default Comments; 