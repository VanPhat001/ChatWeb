const { Schema, model } = require('mongoose')

const schema = new Schema({
    requestAddFriend: [String]
}, { timestamps: true })

module.exports = model('RequestAddFriendContainer', schema)