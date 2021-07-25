const router = require('express').Router()
const db = require('../../models')
const authLockedRoute = require('./authLockedRoute')


// GET - /tasks - get all tasks for the user associated with the token
router.get('/', authLockedRoute, (req,res) => {
    res.json({ tasks: res.locals.user.tasks})
})

//POST - /tasks - new task in body, jwt token in auth headers
router.post('/', authLockedRoute, async (req,res) => {
    try {
        res.locals.user.tasks.push(req.body.task)
        console.log(res.locals.user.tasks)
        await res.locals.user.save()
        res.json({ task: res.locals.user.tasks[res.locals.user.tasks.length-1] })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error '})
    }
})

// PUT - /tasks - update task. task in body, token in headers
router.put('/', authLockedRoute, async (req,res) => {
    try {
        let i = res.locals.user.tasks.findIndex(task => task._id == req.body.task._id)
        res.locals.user.tasks[i] = req.body.task
        await res.locals.user.save()
        res.json({msg: `task ${req.body.task._id} successfully updated`})
    } catch(err){
        console.log(err)
        res.status(500).json({ msg: 'internal server error' })
    }
})

//DELETE - /tasks - delete a task. taskId in body, token in headers
router.delete('/', authLockedRoute, async (req,res) => {
    try {
        res.locals.user.tasks.id(req.body.taskId).remove()
        res.locals.user.save()
        res.json({msg: `task ${req.body.taskId} successfully deleted`})
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error'})
    }
})

module.exports = router