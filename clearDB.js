require('dotenv').config()
const db = require('./models')
db.connect()

const clearDb = async () => {
    try {
        await db.User.deleteMany({})
        // console.log('all users deleted')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

clearDb()