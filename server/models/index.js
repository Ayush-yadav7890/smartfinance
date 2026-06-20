const sequelize = require('../config/database');
const User = require('./User');
const Transaction = require('./Transaction');
const Budget = require('./Budget');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('All models synced');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = { sequelize, User, Transaction, Budget, syncDatabase };
