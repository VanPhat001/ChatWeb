const { Schema, model } = require('mongoose')

const schema = new Schema({
    author: {
        type: String,
        required: true
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
        },
    },
    likes: {
        type: Array,
        default: []
    },
    visibility: {
        type: String,
        enum: ['private', 'public', 'friends'],
        default: 'public'
    },
    shareFromPost: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = model('Post', schema)