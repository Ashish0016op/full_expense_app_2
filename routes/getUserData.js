const express=require('express');
const router=express.Router();
const AllDataControllers=require('../controllers/AllData');
const middlewareAuth=require('../middleware/auth');
router.get('/AllData',middlewareAuth.authenticate,AllDataControllers.getAllData);

module.exports=router;