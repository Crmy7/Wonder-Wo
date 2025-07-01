// Initialisation de la connexion à la BDD
import { Sequelize } from 'sequelize';

const sequelizeInstance = new Sequelize(
    process.env.DB_NAME || 'wonder_wo',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelizeInstance;
