const { Schema, model } = require('mongoose')

const schema = new Schema({
    accountId1: {
        type: String,
        required: true
    },
    accountId2: {
        type: String,
        required: true
    }
}, { timestamps: true })

schema.index({ accountId1: 1, accountId2: 1 }, { unique: true })

module.exports = model('Friend', schema)