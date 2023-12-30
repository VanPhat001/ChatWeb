const router = require('express').Router()

const { authenToken } = require('../helpers')
const messageService = require('../services/messageService')
const roomService = require('../services/roomService')


// get latest 20 message in room
router.get('/:id', authenToken, async (req, res, next) => {
    let { messageCount } = req.query
    const { id } = req.params

    if (!messageCount) {
        messageCount = 20
    }

    try {
        const messageDocs = await messageService.getAll({
            roomId: id
        })
            .sort({ createdAt: 'desc' })
            .limit(messageCount)
            .sort({ createdAt: 'asc' })

        res.send({ status: 'success', messages: messageDocs })
    } catch (error) {
        next(error)
    }
})

module.exports = router