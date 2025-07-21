const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  otp: { type: DataTypes.STRING },
  otp_expiry: { type: DataTypes.DATE }
}, {
  timestamps: true
});

module.exports = User;
