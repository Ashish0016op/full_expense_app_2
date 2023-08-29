const path=require('path');
const express= require('express');
const router=express.Router();
const signUpRoute=require('../controllers/signUp');
router.post('/signUp',signUpRoute.postDetails);
module.exports=router;