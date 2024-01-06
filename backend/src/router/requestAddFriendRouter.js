const router = require('express').Router()

const requestAddFriendContainerService = require('../services/requestAddFriendContainerService')
const requestAddFriendService = require('../services/requestAddFriendService')


router.post('/', (req, res, next) => {
    const { accountFrom, accountTo } = req.body

    try {
        
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', (req, res, next) => {
    const { id } = req.params

    try {
        
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const doc = await requestAddFriendService.getOne({ _id: id })
        res.send({ status: 'success', requestAddFriend: doc })
    } catch (error) {
        next(error)
    }
})

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