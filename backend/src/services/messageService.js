const { removeNullProps } = require('../helpers')
const MessageModel = require('../models/MessageModel')


class MessageService {
    constructor() {
        this.Message = MessageModel
    }

    getAll(payload) {
        return this.Message.find(payload)
    }

    getOne(payload) {
        return this.Message.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.Message.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Message.deleteMany(payload)
    }

    create(payload) {
        return this.Message.create(payload)
    }
}

module.exports = new MessageService()