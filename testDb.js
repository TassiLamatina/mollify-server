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

        const newTask = new db.Task({
            title: 'test title',
            description: 'test description',
            notes: 'test notes',
            dateAdded: null,
            priority: 'high',
            status: 'incomplete'
        })

        // console.log(` ${newTask} 🎉`)
        newUser.tasks.push(newTask)

        await newUser.save()
       

    } catch (err) {
        console.log(err)
    }
}

dbTest()