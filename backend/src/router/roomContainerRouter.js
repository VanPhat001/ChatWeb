const { authenToken } = require('../helpers')
const accountService = require('../services/accountService')
const roomContainerService = require('../services/roomContainerService')
const roomService = require('../services/roomService')

const router = require('express').Router()

router.route('/')
    // get all rooms
    .get(authenToken, async (req, res, next) => {
        const accountId  = req.data._id

        if (!accountId) {
            return res.status(401).send({ status: 'error' })
        }

        try {
            const accountDoc = await accountService.getOne({ _id: accountId })
            const roomContainerId = accountDoc.roomContainerId

            const roomContainerDoc = await roomContainerService.getOne({ _id: roomContainerId })
            const roomIdArray = roomContainerDoc.rooms

            const tasks = []
            roomIdArray.forEach(roomId => {
                tasks.push(roomService.getOne({ _id: roomId }))
            })

            const rooms = await Promise.all(tasks)

            res.send({ status: 'success', rooms })
        } catch (error) {
            next(error)
        }
    })

module.exports = router