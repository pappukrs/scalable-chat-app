const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('✅ Auth service running on http://localhost:3000'));
});
