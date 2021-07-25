require('dotenv').config()
const db = require('./models')
db.connect() // test db connection

const dbTest = async () => {
    try{
        // CREATE
        const newUser = new db.User({
            name: 'test task user 1',
            email: '1@2.com',
            password: 'oliver'
        })

        const newTask = {
            title: 'test title',
            description: 'test description',
            notes: 'test notes',
            dateAdded: null,
            priority: 'high',
            status: 'incomplete',
        }

        newUser.tasks.push(newTask)

        await newUser.save()
        console.log('new user:', newUser)

        // READ -- st login
        const foundUser = await db.User.findOne({
            name: "test task user 1"
        })
        console.log('found user:', foundUser)

    } catch (err) {
        console.log(err)
    }
}

dbTest()