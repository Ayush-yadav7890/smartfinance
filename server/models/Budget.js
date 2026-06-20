const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Budget = sequelize.define('Budget', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  limit_amount: { type: DataTypes.FLOAT, allowNull: false },
  month: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

User.hasMany(Budget, { foreignKey: 'user_id' });
Budget.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Budget;
