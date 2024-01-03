const { removeNullProps } = require('../helpers')
const CommentModel = require('../models/CommentModel')


class CommentService {
    constructor() {
        this.Comment = CommentModel
    }

    getAll(payload) {
        return this.Comment.find(payload)
    }

    getOne(payload) {
        return this.Comment.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.Comment.updateOne({ _id: id }, { ...payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Comment.deleteMany(payload)
    }

    create(payload) {
        return this.Comment.create(payload)
    }
}

module.exports = new CommentService()