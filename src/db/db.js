import Sequelize from 'sequelize';
import configFile from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env]

// console.log(config);

export const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);
