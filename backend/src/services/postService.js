const { removeNullProps } = require('../helpers')
const PostModel = require('../models/PostModel')

class PostService {
    constructor() {
        this.Post = PostModel
    }

    getAll(payload) {
        return this.Post.find(payload)
    }

    getOne(payload) {
        return this.Post.findOne(payload)
    }

    updateOne(id, payload, options = { allowNullFields: false }) {
        if (!options.allowNullFields) {
            removeNullProps(payload)
        }
        return this.Post.updateOne({ _id: id }, { $set: payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Post.deleteMany(payload)
    }

    create(payload) {
        return this.Post.create(payload)
    }
}

module.exports = new PostService()