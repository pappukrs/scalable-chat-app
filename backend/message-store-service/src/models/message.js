const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const Message = sequelize.define('Message', {
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
//   timestamp: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
});

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await Message.sync();
    console.log('✅ Message table synced');
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
};

module.exports = { Message, initDb };
