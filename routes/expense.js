const express=require('express');
const router=express.Router();
const expenseDetails=require('../controllers/expense');
const authorization=require('../middleware/auth');
router.post('/expense',authorization.authenticate,expenseDetails.postDetails);
router.get('/get_expense',authorization.authenticate,expenseDetails.getDetails);
router.get('/download',authorization.authenticate,expenseDetails.downloadExpense);
router.delete('/delete_expense/:id',authorization.authenticate,expenseDetails.deleteDetails);
module.exports=router;