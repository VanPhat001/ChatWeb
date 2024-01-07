const router = require('express').Router()

const axios = require('axios')
const accountService = require('../services/accountService')
const requestAddFriendContainerService = require('../services/requestAddFriendContainerService')
const requestAddFriendService = require('../services/requestAddFriendService')

router.post('/RESET', async (req, res, next) => {
    try {
        const task1 = requestAddFriendContainerService.RequestAddFriendContainer.updateMany({}, {
            $set: {
                requestAddFriend: []
            }
        })

        const task2 = requestAddFriendService.RequestAddFriend.deleteMany({})

        await Promise.all([task1, task2])

        res.send({ status: 'success' })
    } catch (error) {
        next(error)
    }
})

// tạo mới requestAddFriend và cập nhật requestAddFriendContainer
router.post('/', async (req, res, next) => {
    const { accountFrom, accountTo } = req.body

    try {
        const doc = await requestAddFriendService.create({
            accountFrom,
            accountTo
        })

        async function updateRequestAddFriendContainer(accountId) {
            const accountDoc = await accountService.getOne({ _id: accountId })
            return await requestAddFriendContainerService.RequestAddFriendContainer.updateOne({
                _id: accountDoc.requestAddFriendContainerId
            }, {
                $push: {
                    requestAddFriend: doc._id
                }
            })
        }

        const task1 = updateRequestAddFriendContainer(accountFrom)
        const task2 = updateRequestAddFriendContainer(accountTo)

        await Promise.all([task1, task2])

        res.send({ status: 'success', requestAddFriend: doc })
    } catch (error) {
        next(error)
    }
})

// xoá requestAddFriend có _id tương ứng và đồng thời cập nhật lại requestAddFriendContainer
router.delete('/:id', (req, res, next) => {
    const { id } = req.params

    try {

    } catch (error) {
        next(error)
    }
})

router.delete('/:from/:to/accept', async (req, res, next) => {
    const { from: accountFrom, to: accountTo } = req.params

    try {
        const requestAddFriendDoc = await requestAddFriendService.RequestAddFriend.findOneAndDelete({
            accountFrom,
            accountTo
        })

        async function updateRequestAddFriendContainer(accountId, value) {
            const accountDoc = await accountService.getOne({ _id: accountId })
            return await requestAddFriendContainerService.RequestAddFriendContainer.updateOne({
                _id: accountDoc.requestAddFriendContainerId
            }, {
                $pull: {
                    requestAddFriend: value
                }
            })
        }

        const task1 = updateRequestAddFriendContainer(accountFrom, requestAddFriendDoc._id)
        const task2 = updateRequestAddFriendContainer(accountTo, requestAddFriendDoc._id)

        await Promise.all([task1, task2])

        const result = await axios.post(`http://localhost:${process.env.PORT}/api/friend`, {
            accountId1: accountFrom,
            accountId2: accountTo
        })

        res.send({ status: 'success', data: result.data })
    } catch (error) {
        next(error)
    }
})

router.delete('/:from/:to/cancel', async (req, res, next) => {
    const { from: accountFrom, to: accountTo } = req.params

    try {
        const requestAddFriendDoc = await requestAddFriendService.RequestAddFriend.findOneAndDelete({
            accountFrom,
            accountTo
        })

        async function updateRequestAddFriendContainer(accountId, value) {
            const accountDoc = await accountService.getOne({ _id: accountId })
            return await requestAddFriendContainerService.RequestAddFriendContainer.updateOne({
                _id: accountDoc.requestAddFriendContainerId
            }, {
                $pull: {
                    requestAddFriend: value
                }
            })
        }

        const task1 = updateRequestAddFriendContainer(accountFrom, requestAddFriendDoc._id)
        const task2 = updateRequestAddFriendContainer(accountTo, requestAddFriendDoc._id)

        await Promise.all([task1, task2])

        // const result = await axios.post(`http://localhost:${process.env.PORT}/api/friend`, {
        //     accountId1: accountFrom,
        //     accountId2: accountTo
        // })

        res.send({ status: 'success' })
    } catch (error) {
        next(error)
    }
})

// tìm kiếm requestAddFriend có _id tương ứng
router.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const doc = await requestAddFriendService.getOne({ _id: id })
        res.send({ status: 'success', requestAddFriend: doc })
    } catch (error) {
        next(error)
    }
})

// tìm kiếm những account gửi lời mời kết bạn đến account._id == accountId
router.get('/to/:accountId', async (req, res, next) => {
    const { accountId } = req.params

    try {
        const accountDoc = await accountService.getOne({ _id: accountId })
        const RAFCdoc = await requestAddFriendContainerService.getOne({ _id: accountDoc.requestAddFriendContainerId })

        const tasks = []
        RAFCdoc.requestAddFriend.forEach(id => {
            const task = requestAddFriendService.getOne({ _id: id })
            tasks.push(task)
        })

        const requestAddFriendDocs = await Promise.all(tasks)
        const accountIds = requestAddFriendDocs
            .filter(({ accountFrom, accountTo }) => accountTo == accountId)
            .map(({ accountFrom }) => accountFrom)

        res.send({ status: 'success', accountIds })
    } catch (error) {
        next(error)
    }
})

// tìm kiếm requestAddFriend có accountFrom == from và accountTo == to
router.get('/:from/:to', async (req, res, next) => {
    const { from: accountFrom, to: accountTo } = req.params

    try {
        const doc = await requestAddFriendService.getOne({
            accountFrom,
            accountTo
        })
        res.send({ status: 'success', requestAddFriend: doc })
    } catch (error) {
        next(error)
    }
})

module.exports = router