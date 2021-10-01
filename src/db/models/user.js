const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const UserSchema = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, required: true },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING, default: "none" },
  status: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  isActivated: { type: DataTypes.BOOLEAN, default: false },
  activationLink: { type: DataTypes.STRING },
});

export default {
  UserSchema,
};
