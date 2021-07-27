require('dotenv').config()
const db = require('./models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

db.connect()

const seedDb = async () => {
    let today = new Date().toISOString().split('T')[0]
    try {
        const testTasks = [{
            title: 'Laundry',
            description: "You need clean clothes!",
            notes: "Seriously it's been 6 weeks!",
            dateAdded: today,
            priority: 'High',
            status: 'incomplete',
            createdAt: new Date()
        },
        {
            title: 'Pickup Steves Kibble',
            description: "He only has 4 days of food left!",
            notes: "Just try saying no to that face!",
            dateAdded: today,
            priority: 'High',
            status: 'incomplete',
            createdAt: new Date()
            
        },
        {
            title: 'Apply to SE Jobs',
            description: "Steve's Kibble is expensive! You need a good Job!",
            notes: "Look at jobs on Indeed this week!",
            dateAdded: today,
            priority: 'High',
            status: 'incomplete',
            createdAt: new Date()
        },
        {
            title: 'Dust the House',
            description: "Wanna stop sneezing?",
            notes: "Make sure to use the Swiffer duster for that fan tho!",
            dateAdded: today,
            priority: 'Medium',
            status: 'incomplete',
            createdAt: new Date()
        },
        {
            title: 'Buy New Candles for the house',
            description: "Something more earthy",
            notes: "Like tobbacco and bergamot or Oud Wood",
            dateAdded: today,
            priority: 'Low',
            status: 'incomplete',
            createdAt: new Date()
        }]

        const password = await bcrypt.hash('testpw', 3)

        const testUsers = [
            {
                name: 'Steve Lamatina',
                email: 'steve@lamatina.com',
                password: password,
                tasks: testTasks
            },
            {
                name: 'Tassiana Lamatina',
                email: 'tassiana@lamatina.com',
                password: password,
                tasks: testTasks
            }
        ]
        await db.Task.insertMany(testTasks)

       await db.User.insertMany(testUsers)

        let count = await db.User.countDocuments({})
        console.log(`db seeded with ${count} users`)
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

seedDb()