const { Schema, model } = require('mongoose')

const schema = new Schema({
    friends: [String]
}, { timestamps: true })

module.exports = model('FriendContainer', schema)