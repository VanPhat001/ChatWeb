const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: String,
    password: String
}, { timestamps: true })

module.exports = model('Test', schema)