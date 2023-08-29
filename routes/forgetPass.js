const express = require('express');

const resetpasswordController = require('../controllers/forgetPass');
const middlewareAuth=require('../middleware/auth');

const router = express.Router();
router.post('/forgotpassword',middlewareAuth.authenticate, resetpasswordController.forgotpassword)
router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)


module.exports = router;