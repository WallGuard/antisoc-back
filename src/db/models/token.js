const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const TokenSchema = sequelize.define("user", {
  user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING },
});

export default {
  TokenSchema
};
