const express=require('express');
const router=express.Router();
const loginDetails=require('../controllers/login');
router.post('/login', loginDetails.login);
router.get('/user_login',loginDetails.getDetails);
module.exports=router;