const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute.js')

// GET /users -- test api endpoint
router.get('/', (req, res) => {
    // console.log("hello user route 👌🏼👌🏼👌🏼")
    res.json({ msg: 'hi! the user endpoint is okay 👌🏼'})
})

// POST /users/register -- CREATE a new user (aka registration)
router.post('/register', async (req, res) => {
    try {
        // check if user exists already
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        // if the user is found -- dont let them register
        if(findUser) return res.status(400).json({ msg: 'user already exists in the db '})
        // console.log(findUser)
        // hash password from req.body
        const password = req.body.password
        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)

        // create our new user
        const newUser = db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()

        // create the jwt payload
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }

        // sign the jwt and send response
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60})

        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error '})
    }
})

// POST /user.login -- validate login credentials
router.post('/login', async (req, res) => {
    try {
        // try to find the user in the database from the req.body.email
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        const validationFailedMessage = 'Incorect username or password 😢'

        // if user found -- return immediately
        if(!findUser) return res.status(400).json({ msg: validationFailedMessage })

        // check users password from db against what is in the req.body
        const matchPassword = await bcrypt.compare(req.body.password, findUser.password)

        // if the password doesnt match -- return immediately
        if(!matchPassword) return res.status(400).json({ msg: validationFailedMessage })

        // create the jwt payload 
        const payload = {
            name: findUser.name,
            email: findUser.email,
            id: findUser.id
        }

        // sign the jwt and send it back
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        res.json({ token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error '})
    }
})

// route for 
router.get('/tasks', authLockedRoute, (req, res) =>{
    db.User.find({ email: res.locals.user.email }).then(user => {
        // console.log(user)
        res.json(user)
    })
    
})

//POST - /tasks - new task in body, jwt token in auth headers
router.post('/tasks', authLockedRoute, async (req,res) => {
    try {
        res.locals.user.tasks.push(req.body.task)
        // console.log(res.locals.user.tasks)
        await res.locals.user.save()
        res.json({ task: res.locals.user.tasks[res.locals.user.tasks.length-1] })
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error '})
    }
})

// PUT - /tasks - update task. task in body, token in headers
router.put('/tasks', authLockedRoute, async (req,res) => {
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
router.delete('/tasks', authLockedRoute, async (req,res) => {
    try {
        res.locals.user.tasks.id(req.body.taskId).remove()
        res.locals.user.save()
        res.json({msg: `task ${req.body.taskId} successfully deleted`})
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'internal server error'})
    }
})

// GET /auth-locked -- will redirect if bad or no jwt is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
    // do whatever we like with the user
    // console.log(res.locals.user)
    // send private data back
    res.json({ msg: 'welcome to the auth locked route you lucky dog 🐶' })
})



module.exports = router 