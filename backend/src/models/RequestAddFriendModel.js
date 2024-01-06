const { Schema, model } = require('mongoose')

const schema = new Schema({
    accountFrom: {
        type: String,
        required: true
    },
    accountTo: {
        type: String,
        required: true
    }
}, { timestamps: true })

schema.index({ accountFrom: 1, accountTo: 1 }, { unique: true })

module.exports = model('RequestAddFriend', schema)