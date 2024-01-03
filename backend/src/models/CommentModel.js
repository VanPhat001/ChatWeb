const { Schema, model } = require('mongoose')

const schema = new Schema({
    accountId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: null
    },
    image: {
        publicId: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        }
    },
    commentReplyId: {
        type: String,
        default: null
    },

}, { timestamps: true })

module.exports = model('Comment', schema)