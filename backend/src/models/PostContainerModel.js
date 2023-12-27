const { Schema, model } = require('mongoose')

const schema = new Schema({
    posts: [String]
}, { timestamps: true })

module.exports = model('PostContainer', schema)