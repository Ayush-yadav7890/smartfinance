const { Transaction } = require('../models/index');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC']],
    });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    const transaction = await Transaction.create({
      user_id: req.user.id,
      type,
      category,
      amount,
      description,
      date,
    });
    res.status(201).json({ message: 'Transaction added', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await Transaction.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTransactions, addTransaction, deleteTransaction };