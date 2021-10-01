// import fs from 'fs';
// import path from 'path';
// import Sequelize from 'sequelize';
// import configFile from '../../config/config.json';

// const basename = path.basename(module.filename);
// const env = process.env.NODE_ENV || 'development';
// // console.log(process.env);
// const config = configFile[env]
// // console.log(config);
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable]);
// } else {
//   sequelize = new Sequelize(
//     config.database, config.username, config.password, config
//   );
// };

// fs
//   .readdirSync(__dirname)
//   .filter((file) =>
//     (file.indexOf('.') !== 0) &&
//     (file !== basename) &&
//     (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     // const model = sequelize.import(path.join(__dirname, file));

//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

//     // const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//     console.log(db[model.name]);
//     // console.log(sequelize.define(path.join(__dirname, file)));
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// // console.log(db);

// export default db;
