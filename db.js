const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('dashboard', 'root', 'suraj8700', {
    host: 'localhost',
    dialect: "mysql",
    port: 3306
})

module.exports = {sequelize}
