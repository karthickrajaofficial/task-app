const asyncHandler = require ('express-async-handler')
const Task = require('../model/taskModel')
const User = require ('../model/userModel')

const getTasks = asyncHandler(async(req,res) => {
    const tasks = await Task.find({user:req.user.id})
    res.status(200).json(tasks)
})
const setTasks = asyncHandler(async(req,res) => {
   if(!req.body.text){
    res.status(400)
    throw new Error ('plese enter text field')

   }
   const task = await Task.create ({
    text : req.body.text ,
    user: req.user.id,
    description: req.body.description,
    status: 'To Do'
   })
    res.status(200).json(task)
})
const putTasks = asyncHandler(async(req,res) => {
    const task = await Task.findById(req.params.id)
    if(!task){
       res.status(400)
       throw new Error ('Task not found')
    }

    if(!req.user){
        res.status(401)
        throw new Error('user not found ')
    }
    if (task.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('user not Authorised ')
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    })
    res.status(200).json (updatedTask)
})
// Update a task
const updateTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
     
      task.description = req.body.description || task.description;
     
      const updatedTask = await task.save();
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const deleteTasks = asyncHandler(async (req,res) => {
    const task = await Task.findById(req.params.id)
    if(!task){
       res.status(400)
       throw new Error ('Task not found')
    }

    if(!req.user){
        res.status(401)
        throw new Error('user not found ')
    }
    if (task.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('user not Authorised ')
    }
   await task.deleteOne()
    res.status(200).json ({ id: req.params.id })
})
module.exports ={
    getTasks,
    setTasks,
    putTasks,
    deleteTasks,
    updateTask
}