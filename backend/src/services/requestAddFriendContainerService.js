const { removeNullProps } = require('../helpers')
const RequestAddFriendContainerModel = require('../models/RequestAddFriendContainerModel')


class RequestAddFriendContainerService {
    constructor() {
        this.RequestAddFriendContainer = RequestAddFriendContainerModel
    }

    getAll(payload) {
        return this.RequestAddFriendContainer.find(payload)
    }

    getOne(payload) {
        return this.RequestAddFriendContainer.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.RequestAddFriendContainer.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.RequestAddFriendContainer.deleteMany(payload)
    }

    create(payload) {
        return this.RequestAddFriendContainer.create(payload)
    }
}

module.exports = new RequestAddFriendContainerService()