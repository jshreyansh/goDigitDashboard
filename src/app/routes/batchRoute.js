const express = require('express');
const auth = require('../middleware/auth');
const batchController = require('../controllers/batchController');
const router = express.Router();

router.get('/add-batch', auth, batchController.addBatch);
router.get('/batch-list',auth, batchController.batchList);
router.get('/manage-batch', auth, batchController.manageBatch);
router.get('/edit-batch/:batchId', auth, batchController.editBatch);

router.post('/update-batch/:batchId', auth, batchController.updateBatch);
router.post('/create-batch', auth, batchController.createBatch);
router.get('/delete-batch/:batchId',auth, batchController.deleteBatch)
router.get('/moveTaughtTopic-batch/:batchId/:topicName',auth, batchController.moveTaughtTopic)
module.exports=router;