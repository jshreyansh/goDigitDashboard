const express = require('express');
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController');
const router = express.Router();

router.get('/add-question', auth, quizController.addQuestion);
router.post('/create-question', auth, quizController.createQuestion);
router.get('/manage-question', auth, quizController.manageQuestions);
router.post('/save-category', auth, quizController.saveCategory);

router.post('/find-topic-questions', auth, quizController.findTopicQuestions);
router.get('/delete-question/:questionID',auth,quizController.deleteQuestion)
router.post('/update-question/:questionID', auth, quizController.updateQuestion);
router.post('/update-item/:itemID', auth, quizController.updateItem);


router.get('/edit-question/:questionID',auth,quizController.editQuestion)



module.exports=router;