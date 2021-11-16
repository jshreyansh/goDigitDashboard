const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/sign-up', userController.register);
router.get('/signing-up', userController.signUp);
router.post('/login', userController.login);


//router.post('/login', userController.login);



module.exports=router;