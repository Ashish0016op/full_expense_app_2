const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const totalExp=sequelize.define('TotalExpenses',{
    id:{
       type:Sequelize.INTEGER,
       autoIncrement:true,
       allowNull:false,
       primaryKey:true
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    
})
module.exports=totalExp;