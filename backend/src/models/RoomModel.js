const { Schema, model } = require('mongoose')

const schema = new Schema({
    roomName: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        require: true
    },
    avatar: {
        type: String,
        default: null
    },
    latestMessageId: {
        type: String,
        default: null
    },
}, { timestamps: true })

module.exports = model('Room', schema)