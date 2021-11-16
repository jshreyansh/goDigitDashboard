const express=require('express');
const auth = require('../middleware/auth');
const passport = require('passport');
const adminController=require('../controllers/adminController');
const router=express.Router();

router.get('/', adminController.homePage);
router.get('/logout', adminController.logOut);
router.get('/dashboard', auth, adminController.dashboard);

module.exports=router;