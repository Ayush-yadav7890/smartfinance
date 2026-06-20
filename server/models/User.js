const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  monthly_salary: { type: DataTypes.FLOAT, defaultValue: 0 },
  savings_goal: { type: DataTypes.FLOAT, defaultValue: 0 },
  emergency_fund: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { timestamps: true });

module.exports = User;