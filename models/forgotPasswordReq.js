const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const forgotPasswordRequest = sequelize.define('forgotpassword',{
    id:{
        type:Sequelize.UUID,
        primaryKey: true        
    },
    isactive:{type:Sequelize.BOOLEAN}

})

module.exports = forgotPasswordRequest;