const router = require('express').Router()

const { authenToken } = require('../helpers')
const messageService = require('../services/messageService')
const roomService = require('../services/roomService')


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

        await roomService.updateOne(_id, {
            latestMessageId: messageDoc._id
        })

        res.send({ status: 'success', message: messageDoc })
    } catch (error) {
        next(error)
    }
})

module.exports = router