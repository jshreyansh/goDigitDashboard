const express = require('express');
const auth = require('../middleware/auth');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.get('/add-student', auth, studentController.addStudent);
router.get('/manage-student', auth, studentController.manageStudent);
router.get('/add-student', auth, studentController.addStudent);
router.get('/edit-student/:studentId', auth, studentController.editStudent);

router.post('/update-student/:studentId', auth, studentController.updateStudent);
router.post('/find-student', auth, studentController.findStudent);
router.post('/find-student-batch', auth, studentController.findStudentBatch);
router.get('/find-student-batch/:batchId',auth, studentController.findStudentBatchPage)
router.post('/create-student', auth, studentController.createStudent);
router.post('/create-student-bulk',auth, studentController.createStudentBulk);
router.get('/delete-student/:studentId',auth,studentController.deleteStudent)
module.exports=router;