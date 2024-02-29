const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const users = sequelize.define('users',{
    id:{
        autoIncrement:true,
        primaryKey : true,
        type:Sequelize.INTEGER,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPremium:{
        type:Sequelize.BOOLEAN,
        defaultValue: false,
    },
    rowPreference:{
        type:Sequelize.INTEGER,
        defaultValue:5
    }
})

module.exports = users;