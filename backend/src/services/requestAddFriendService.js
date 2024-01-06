const { removeNullProps } = require('../helpers')
const RequestAddFriendModel = require('../models/RequestAddFriendModel')


class RequestAddFriendService {
    constructor() {
        this.RequestAddFriend = RequestAddFriendModel
    }

    getAll(payload) {
        return this.RequestAddFriend.find(payload)
    }

    getOne(payload) {
        return this.RequestAddFriend.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.RequestAddFriend.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.RequestAddFriend.deleteMany(payload)
    }

    create(payload) {
        return this.RequestAddFriend.create(payload)
    }
}

module.exports = new RequestAddFriendService()