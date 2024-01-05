const router = require('express').Router()

const friendService = require('../services/friendService')
const friendContainerService = require('../services/friendContainerService')
const accountService = require('../services/accountService')

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

        const task1 = updateFriendContainer(accountId1, accountId2)
        const task2 = updateFriendContainer(accountId2, accountId1)

        await Promise.all([task1, task2])

        res.send({ status: 'success', friend: friendDoc })
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
    let {limit, skip} = req.query
    
    limit = limit ? limit : 15  
    skip = skip ? skip : 0

    try {
        const accountDoc = await accountService.getOne({ _id: accountId })
        const friendContainerDoc = await friendContainerService.getOne({ _id: accountDoc.friendContainerId })
        const friendIds = friendContainerDoc.friends.slice(skip, skip + limit)

        res.send({ status: 'success', friendIds })
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


module.exports = router