const { Schema, model } = require('mongoose')

const schema = new Schema({
    roomName: {
        type: String,
        default: null,
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
    isRoom: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = model('Room', schema)