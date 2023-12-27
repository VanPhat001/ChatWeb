const { removeNullProps } = require('../helpers')
const PostContainerModel = require('../models/PostContainerModel')


class PostContainerService {
    constructor() {
        this.PostContainer = PostContainerModel
    }

    getAll(payload) {
        return this.PostContainer.find(payload)
    }

    getOne(payload) {
        return this.PostContainer.findOne(payload)
    }

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.PostContainer.updateOne({
            _id: id,
            ...payload
        })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.PostContainer.deleteMany(payload)
    }

    create(payload) {
        return this.PostContainer.create(payload)
    }
}

module.exports = new PostContainerService()