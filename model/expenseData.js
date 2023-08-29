const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const expenseDetails=sequelize.define('expense_details',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    expense_amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
})

module.exports=expenseDetails;