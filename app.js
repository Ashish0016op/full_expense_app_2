
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const sequelize = require('./util/database');
const signRoutes = require('./routes/signUp');
const loginRoutes=require('./routes/login');
const expenseRoutes=require('./routes/expense');
const PremiumRoutes=require('./routes/premium');
const forgetPassRoutes=require('./routes/forgetPass');
const ExpenseData=require('./model/expenseData');
const Login=require('./model/loginDetails');
const forgotPassword=require('./model/forgetPass');
const totalExps=require('./model/totalExpenses');
const premium=require('./model/order');
const getAllDataRouter=require('./routes/getUserData');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const fs=require('fs');
// const accessLogStream=fs.createReadStream(
//     path.join(__dirname,'access.log'),
//     {flags:'a'}
// );
//app.use(helmet());
app.use(compression());
//app.use(morgan('combined',{stream:accessLogStream}))
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(signRoutes);
app.use(loginRoutes);
app.use(PremiumRoutes);
app.use(expenseRoutes);
app.use(getAllDataRouter);
app.use('/password',forgetPassRoutes);
app.use('/login',(req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.use('/expense',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','expense.html'));
})
app.use('/premiumDash',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','premiumDash.html'));
})
app.use('/forgetPass',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','forgetPass.html'));
})
app.use('/expensesDetails',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','expenseDetails.html'));
})
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'SignUp.html'));
});

Login.hasMany(ExpenseData);
ExpenseData.belongsTo(Login);

Login.hasMany(premium);
premium.belongsTo(Login);

Login.hasOne(totalExps);
totalExps.belongsTo(Login);


Login.hasMany(forgotPassword);
forgotPassword.belongsTo(Login);
sequelize.sync({force:false})
.then(() => {
    console.log('Data sync successful');
    app.listen(5500, () => {
        console.log('Server is running on port 5500');
    });
})
.catch(err => {
    console.error('Database sync error:', err);
});




