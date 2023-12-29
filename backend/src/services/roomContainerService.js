const { removeNullProps } = require('../helpers')
const RoomContainerModel = require('../models/RoomContainerModel')


class RoomContainerService {
    constructor() {
        this.RoomContainer = RoomContainerModel
    }

    getAll(payload) {
        return this.RoomContainer.find(payload)
    }

    getOne(payload) {
        return this.RoomContainer.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.RoomContainer.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.RoomContainer.deleteMany(payload)
    }

    create(payload) {
        return this.RoomContainer.create(payload)
    }
}

module.exports = new RoomContainerService()