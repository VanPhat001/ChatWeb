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
        type: String
    }
}, { timestamps: true })

module.exports = model('Message', schema)