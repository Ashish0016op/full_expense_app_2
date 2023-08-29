const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const signCred= sequelize.define('signupData',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    Username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPremium:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    },
})
module.exports=signCred;