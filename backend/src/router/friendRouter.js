const router = require('express').Router()

const friendService = require('../services/friendService')
const friendContainerService = require('../services/friendContainerService')
const accountService = require('../services/accountService')
const requestAddFriendService = require('../services/requestAddFriendService')
const { default: axios } = require('axios')

router.post('/RESET', async (req, res, next) => {
    try {
        const task1 = friendService.Friend.deleteMany({})
        const task2 = friendContainerService.FriendContainer.updateMany({}, {
            $set: {
                friends: []
            }
        })

        await Promise.all([task1, task2])

        res.send({ status: 'success' })
    } catch (error) {
        console.log(error)
    }
})

// tạo friend và cập nhật friendContainer
router.post('/', async (req, res, next) => {
    let { accountId1, accountId2 } = req.body

    if (accountId1 > accountId2) {
        let temp = accountId1
        accountId1 = accountId2
        accountId2 = temp
    }

    try {
        const friendDoc = await friendService.create({
            accountId1,
            accountId2
        })

        async function updateFriendContainer(accountId1, accountId2) {
            const accountDoc = await accountService.getOne({ _id: accountId1 })
            return await friendContainerService.FriendContainer.updateOne({
                _id: accountDoc.friendContainerId
            }, {
                $push: {
                    friends: accountId2
                }
            })
        }

        const task1 = updateFriendContainer(accountId1, friendDoc._id)
        const task2 = updateFriendContainer(accountId2, friendDoc._id)

        await Promise.all([task1, task2])

        res.send({ status: 'success', friend: friendDoc })
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const friendDoc = await friendService.Friend.findByIdAndDelete(id)
        const accountId1 = friendDoc.value.accountId1
        const accountId2 = friendDoc.value.accountId2

        async function updateFriendContainer(accountId, friendId) {
            const accountDoc = await accountService.getOne({ _id: accountId })
            return await friendContainerService.FriendContainer.updateOne({
                _id: accountDoc.friendContainerId
            }, {
                $pull: {
                    friends: friendId
                }
            })
        }

        const task1 = friendService.delete({ _id: id })
        const task2 = updateFriendContainer(accountId1, id)
        const task3 = updateFriendContainer(accountId2, id)

        await Promise.all([task1, task2, task3])

        res.send({ status: 'success' })
    } catch (error) {
        next(error)
    }
})

// tìm friend dựa trên _id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const friendDoc = await friendService.getOne({ _id: id })
        res.send({ status: 'success', friend: friendDoc })
    } catch (error) {
        next(error)
    }
})

// tìm friend dựa trên friend.accountId1 == id || friend.accountId2 == id
router.get('/account/:id', async (req, res, next) => {
    const { id: accountId } = req.params
    let { limit, skip } = req.query

    limit = limit ? limit : 15
    skip = skip ? skip : 0

    try {
        const accountDoc = await accountService.getOne({ _id: accountId })
        const friendContainerDoc = await friendContainerService.getOne({ _id: accountDoc.friendContainerId })
        const friendIds = friendContainerDoc.friends.slice(skip, skip + limit)

        const tasks = []
        friendIds.forEach(friendCollectionId => {
            console.log(friendCollectionId)
            tasks.push(friendService.getOne({ _id: friendCollectionId }))
        })
        const friendDocs = await Promise.all(tasks)

        console.log({ friendDocs })
        const arr = friendDocs.map(({ accountId1, accountId2 }) => accountId1 == accountId ? accountId2 : accountId1)

        res.send({ status: 'success', friendIds: arr })
    } catch (error) {
        next(error)
    }
})

router.delete('/:id1/:id2', async (req, res, next) => {
    let { id1, id2 } = req.params

    if (id1 > id2) {
        let temp = id1
        id1 = id2
        id2 = temp
    }

    try {
        const friendDoc = await friendService.Friend.findOneAndDelete({
            accountId1: id1,
            accountId2: id2
        })

        async function updateFriendContainer(accountId, friendId) {
            const accountDoc = await accountService.getOne({ _id: accountId })
            return await friendContainerService.FriendContainer.updateOne({
                _id: accountDoc.friendContainerId
            }, {
                $pull: {
                    friends: friendId
                }
            })
        }

        console.log({ friendDoc })
        const id = friendDoc._id
        const accountId1 = friendDoc.accountId1
        const accountId2 = friendDoc.accountId2

        const task1 = friendService.delete({ _id: id })
        const task2 = updateFriendContainer(accountId1, id)
        const task3 = updateFriendContainer(accountId2, id)

        await Promise.all([task1, task2, task3])

        res.send({ status: 'success' })
    } catch (error) {
        next(error)
    }
})

// tìm friend có friend.accountId1 == id1 && friend.accountId2 == id2 (id1 < id2)
router.get('/:id1/:id2', async (req, res, next) => {
    const { id1: accountId1, id2: accountId2 } = req.params

    if (accountId1 > accountId2) {
        let temp = accountId1
        accountId1 = accountId2
        accountId2 = temp
    }

    try {
        const friendDoc = await friendService.getOne({
            accountId1,
            accountId2
        })

        res.send({ status: 'success', friend: friendDoc })
    } catch (error) {
        next(error)
    }
})

// gợi ý bạn bè cho account._id == id
router.get('/account/:id/suggest', async (req, res, next) => {
    const { id } = req.params

    try {
        const friendDocs = await friendService.Friend.find({})
            .or([{ accountId1: id }, { accountId2: id }])

        const friendIds = friendDocs.map(doc => {
            const { accountId1, accountId2 } = doc
            return accountId1 == id ? accountId2 : accountId1
        })

        const suggestDocs = await friendService.Friend.find({})
            .or([{
                accountId1: { $ne: id },
                accountId2: { $in: friendIds }
            }, {
                accountId2: { $ne: id },
                accountId1: { $in: friendIds }
            }])

        const friendIdSet = new Set(friendIds)
        const suggests = suggestDocs.map(({ accountId1, accountId2 }) => friendIdSet.has(accountId1) ? accountId2 : accountId1)

        const deleteAtIndex = []
        for (let i = 0; i < suggests.length; i++) {
            const accountId = suggests[i]

            const task1 = requestAddFriendService.getOne({
                accountFrom: accountId,
                accountTo: id
            })

            const task2 = requestAddFriendService.getOne({
                accountFrom: id,
                accountTo: accountId
            })

            const [doc1, doc2] = await Promise.all([task1, task2])
            if (doc1 !== null || doc2 !== null) {
                deleteAtIndex.push(i)
            }
        }

        for (let i = deleteAtIndex.length - 1; i >= 0; i--) {
            suggests.splice(deleteAtIndex[i], 1)
        }

        res.send({ status: 'success', suggests })
    } catch (error) {
        next(error)
    }
})

router.get('/:id1/:id2/relationship', async (req, res, next) => {
    const { id1, id2 } = req.params

    try {
        const _id1 = id1 < id2 ? id1 : id2
        const _id2 = _id1 == id1 ? id2 : id1
        const task1 = friendService.getOne({
            accountId1: _id1,
            accountId2: _id2
        })

        const task2 = requestAddFriendService.getOne({
            accountFrom: id1,
            accountTo: id2
        })

        const task3 = requestAddFriendService.getOne({
            accountFrom: id2,
            accountTo: id1
        })

        const [friendDoc, RAFDoc1, RAFDoc2] = await Promise.all([task1, task2, task3])

        let relationship = ''
        if (friendDoc) {
            relationship = 'friend'
        } else if (RAFDoc1) {
            // id1 send request to id2
            relationship = 'send'
        } else if (RAFDoc2) {
            // id2 send request to id1
            relationship = 'receive'
        } else {
            relationship = 'none'
        }

        res.send({ status: 'success', relationship })

    } catch (error) {
        next(error)
    }
})


module.exports = router