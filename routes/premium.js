const express=require('express');
const router=express.Router();
const premiumControllers=require('../controllers/premium');
const middlewareAuth=require('../middleware/auth');
router.get('/pending_prem',middlewareAuth.authenticate,premiumControllers.purchasePremium);
router.post('/success_trans',middlewareAuth.authenticate,premiumControllers.updateTransaction);
module.exports=router;
