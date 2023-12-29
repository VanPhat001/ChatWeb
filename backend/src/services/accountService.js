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

    updateOne(id, payload) {
        removeNullProps(payload)
        return this.Account.updateOne({ _id: id }, { ...payload })
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