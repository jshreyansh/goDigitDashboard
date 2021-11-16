const express = require('express');
const auth = require('../middleware/auth');
const mentorController = require('../controllers/mentorController');
const router = express.Router();

router.get('/add-mentor', auth, mentorController.addMentor);
router.get('/manage-mentor', auth, mentorController.manageMentor);
router.get('/edit-mentor/:mentorId', auth, mentorController.editMentor);

router.post('/update-mentor/:mentorId', auth, mentorController.updateMentor);
router.post('/create-mentor', auth, mentorController.createMentor);
router.get('/delete-mentor/:mentorId',auth, mentorController.deleteMentor)
module.exports=router;