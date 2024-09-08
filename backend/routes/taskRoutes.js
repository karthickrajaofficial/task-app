const express = require('express')
const router = express.Router()
const {getTasks,setTasks,putTasks,deleteTasks,updateTask}= require('../controllers/taskController')
const {protect} = require ('../Middleware/authmiddleware')

router.route('/').get(protect, getTasks).post(protect,setTasks)
router.route('/:id').put(protect,putTasks).delete(protect,deleteTasks).patch(protect,updateTask)


router.patch('/:id/status', (req, res, next) => {
    console.log('PATCH request received');
    next();
  }, updateTask);
  


module.exports = router