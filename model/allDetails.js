const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const AllDetails=sequelize.define('allDetails',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    Name:{
        tyep:Sequelize.STRING,
        allowNull:false,
    },
    totalAmount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    
})