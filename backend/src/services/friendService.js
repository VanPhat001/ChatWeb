const { removeNullProps } = require('../helpers')
const FriendModel = require('../models/FriendModel')


class FriendService {
    constructor() {
        this.Friend = FriendModel
    }

    getAll(payload) {
        return this.Friend.find(payload)
    }

    getOne(payload) {
        return this.Friend.findOne(payload)
    }

    updateOne(id, payload, options = { allowNullFields: false }) {
        if (!options.allowNullFields) {
            removeNullProps(payload)
        }
        return this.Friend.updateOne({ _id: id }, { $set: payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Friend.deleteMany(payload)
    }

    create(payload) {
        return this.Friend.create(payload)
    }
}

module.exports = new FriendService()