const router = require('express').Router()

const { removePasswordProp, authenToken, convertDocsToArrayObject, removeNullProps } = require('../helpers')
const accountService = require('../services/accountService')
const friendContainerService = require('../services/friendContainerService')
const postContainerService = require('../services/postContainerService')
const requestAddFriendContainerService = require('../services/requestAddFriendContainerService')
const roomContainerService = require('../services/roomContainerService')

router.route('/')
    // get account by id
    .get(authenToken, async (req, res, next) => {
        try {
            const { _id } = req.data
            const accountDoc = await accountService.getOne({ _id })
            const account = accountDoc.toObject()
            removePasswordProp(account)
            res.send({ status: 'success', account })
        } catch (error) {
            next(error)
        }
    })
    // create account
    .post(async (req, res, next) => {
        const tasks = [
            friendContainerService.create(),
            postContainerService.create(),
            requestAddFriendContainerService.create(),
            roomContainerService.create()
        ]

        try {
            const [friend, post, requestAddFriend, room] = await Promise.all(tasks)

            const accountDoc = await accountService.create({
                ...req.body,
                roomContainerId: room._id,
                postContainerId: post._id,
                friendContainerId: friend._id,
                requestAddFriendContainerId: requestAddFriend._id
            })
            const account = accountDoc.toObject()

            removePasswordProp(account)

            res.send({ status: 'success', account })
        } catch (error) {
            next(error)
        }
    })

router.post('/list', async (req, res, next) => {
    const { accountIdArray } = req.body

    try {
        const tasks = []
        accountIdArray.forEach(accountId => {
            tasks.push(accountService.Account.findOne({ _id: accountId }, { password: 0 }))
        })

        const accountDocs = await Promise.all(tasks)

        res.send({ status: 'success', accounts: accountDocs })
    } catch (error) {
        next(error)
    }
})

router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    const payload = req.body

    removeNullProps(payload)

    try {
        const accountDoc = await accountService.Account.findOneAndUpdate({ _id: id}, payload, { new: true })
        res.send({ status: 'success', account: accountDoc })
    } catch (error) {
        next(error)
    }
})

router.get('/name/regex/:str', async (req, res, next) => {
    const { str: searchString } = req.params

    try {
        const regexString = searchString.replace(' ', '|')
        const reg = new RegExp('.*' + regexString + '.*', 'i')

        const accountDocs = await accountService.Account.find({
            name: reg
        }, { password: 0 })

        res.send({ status: 'success', accounts: accountDocs })
    } catch (error) {
        next(error)
    }
})

router.route('/:accountId')
    .get(async (req, res, next) => {
        const { accountId } = req.params

        try {
            const accountDoc = await accountService.getOne({ _id: accountId })
            const account = accountDoc.toObject()
            removePasswordProp(account)
            res.send({ status: 'success', account })
        } catch (error) {
            next(error)
        }
    })

module.exports = router