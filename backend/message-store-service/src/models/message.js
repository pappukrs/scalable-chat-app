
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  "chat-app",
  "postgres",
  "postgres",
  {
    host: "localhost",
    port: 5433,
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
