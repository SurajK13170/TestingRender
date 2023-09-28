const {sequelize} = require('../db')
const { Sequelize, DataTypes } = require('sequelize');

const Blog = sequelize.define('Blog', {
  title: {type: DataTypes.STRING, allowNull: false},
  image:{type: DataTypes.STRING, allowNull: false},
  url: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING, allowNull: false},
  blogthumbnail: {type: DataTypes.STRING, allowNull: false},
  content: {type: DataTypes.TEXT, allowNull: false},
  metaTags: {type: DataTypes.STRING, allowNull: false},
  metaKeywords: {type: DataTypes.STRING, allowNull: false},
  metaTitle: {type: DataTypes.STRING, allowNull: false},
  metaDescription: {type: DataTypes.STRING, allowNull: false},
  status: {type: DataTypes.STRING, allowNull: false},
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = {Blog};
