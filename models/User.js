const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
},{
    timestamps: true
})

module.exports = UserSchema 