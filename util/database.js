const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense', 'root', '17Jan@2000',{
    dialect:"mysql",
    host:'localhost',
    define: {
        timestamps: false
      }
})
module.exports = sequelize;