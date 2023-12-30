const { removeNullProps } = require('../helpers')
const AccountModel = require('../models/AccountModel')


class AccountService {
    constructor() {
        this.Account = AccountModel
    }

    getAll(payload) {
        return this.Account.find(payload)
    }

    getOne(payload) {
        return this.Account.findOne(payload)
    }

    updateOne(id, payload, options = { allowNullFields: false }) {
        if (!options.allowNullFields) {
            removeNullProps(payload)
        }
        return this.Account.updateOne({ _id: id }, { $set: payload })
    }

    delete(payload) {
        removeNullProps(payload)
        return this.Account.deleteMany(payload)
    }

    create(payload) {
        return this.Account.create(payload)
    }
}

module.exports = new AccountService()