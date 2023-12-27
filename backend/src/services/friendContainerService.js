const { removeNullProps } = require('../helpers')
const FriendContainerModel = require('../models/FriendContainerModel')


class FriendContainerService {
    constructor() {
        this.FriendContainer = FriendContainerModel
    }

    getAll(payload) {
        return this.FriendContainer.find(payload)
    }

    getOne(payload) {
        return this.FriendContainer.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.FriendContainer.updateOne({
            _id: id,
            ...payload
        })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.FriendContainer.deleteMany(payload)
    }

    create(payload) {
        return this.FriendContainer.create(payload)
    }
}

module.exports = new FriendContainerService()