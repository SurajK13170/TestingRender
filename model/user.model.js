const {sequelize} = require('../db')
const { Sequelize, DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('super admin', 'admin', 'user'), 
    allowNull: false,
    defaultValue: 'user',
  },
});

module.exports = {User};
