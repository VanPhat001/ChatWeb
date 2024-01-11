const { Schema, model } = require('mongoose')

const schema = new Schema({
    sender: {
        type: String,
        required: true,
    },
    roomId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = model('Message', schema)