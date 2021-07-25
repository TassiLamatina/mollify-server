const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    notes: String,
    dateAdded: String,
    priority: String,
    status: String
},{
    timestamps: true
})

module.exports = TaskSchema