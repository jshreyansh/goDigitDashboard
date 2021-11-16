const express=require('express');
const auth = require('../middleware/auth');
const passport = require('passport');
const adminController=require('../controllers/adminController');
const router=express.Router();

router.get('/', adminController.homePage);
router.get('/logout', adminController.logOut);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), adminController.googleCallBack);
router.get('/dashboard', auth, adminController.dashboard);

module.exports=router;