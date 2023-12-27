const { Schema, model } = require('mongoose')

const schema = new Schema({
    rooms: [String]
}, { timestamps: true })

module.exports = model('RoomContainer', schema)