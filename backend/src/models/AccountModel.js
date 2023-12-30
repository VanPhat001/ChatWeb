const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastActive: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    avatar: {
        type: String,
        default: 'https://hcccl.hatinh.gov.vn/portaldvc/images/no-avatar-male.jpg'
    },
    background: {
        type: String,
        default: 'https://img.freepik.com/premium-photo/white-abstract-background-smooth-photo_136558-8632.jpg?w=360'
    },
    dateOfBirth: {
        type: Date,
        default: Date.now()
    },
    roomContainerId: {
        type: String,
        required: true
    },
    postContainerId: {
        type: String,
        required: true
    },
    friendContainerId: {
        type: String,
        required: true
    },
    requestAddFriendContainerId: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = model('Account', schema)