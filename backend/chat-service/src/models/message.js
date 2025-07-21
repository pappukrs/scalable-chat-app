const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
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
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
});

(async () => {
  await sequelize.sync({ alter: true });
  console.log('✅ Message table synced');
})();

module.exports = { Message, sequelize };
