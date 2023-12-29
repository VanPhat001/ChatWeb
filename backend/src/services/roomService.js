const { removeNullProps } = require('../helpers')
const RoomModel = require('../models/RoomModel')


class RoomService {
    constructor() {
        this.Room = RoomModel
    }

    getAll(payload) {
        return this.Room.find(payload)
    }

    getOne(payload) {
        return this.Room.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.Room.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Room.deleteMany(payload)
    }

    create(payload) {
        return this.Room.create(payload)
    }
}

module.exports = new RoomService()