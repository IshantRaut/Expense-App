const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const download = sequelize.define('download',{
    downloadlinks:{
       type:Sequelize.STRING
    }
})

module.exports = download;