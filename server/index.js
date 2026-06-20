const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { syncDatabase } = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SmartFinance API running' });
});

const PORT = process.env.PORT || 5000;
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
});
