const router = require('express').Router()

const { authenToken } = require('../helpers')
const messageService = require('../services/messageService')
const roomService = require('../services/roomService')


router.post('/latest', authenToken, async (req, res, next) => {
    try {
        const { latestMessageIdArray } = req.body

        const tasks = []
        latestMessageIdArray.forEach(latestMessageId => {
            tasks.push(messageService.getOne({ _id: latestMessageId }))
        })

        const latestMessageDocs = await Promise.all(tasks)
        res.send({status: 'success', latestMessages: latestMessageDocs})
    } catch (error) {
        next(error)
    }
})

// create message and update latestMessageId in room
router.post('/:accountId', authenToken, async (req, res, next) => {
    const { accountId: sender } = req.params
    const { roomId, text } = req.body

    try {
        const messageDoc = await messageService.create({
            sender,
            roomId,
            text
        })

        await roomService.updateOne(roomId, {
            latestMessageId: messageDoc._id
        })

        res.send({ status: 'success', message: messageDoc })
    } catch (error) {
        next(error)
    }
})

module.exports = router