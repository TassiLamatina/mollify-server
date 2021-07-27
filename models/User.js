const mongoose = require('mongoose')
const TaskSchema = require('./Task.js')

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    tasks: [
        TaskSchema
    ]
},{
    timestamps: true
})

module.exports = UserSchema 