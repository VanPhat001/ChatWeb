const router = require('express').Router()

const { authenToken, convertDocsToArrayObject } = require('../helpers')
const messageService = require('../services/messageService')
const roomService = require('../services/roomService')
const roomContainerService = require('../services/roomContainerService')
const accountService = require('../services/accountService')

router.post('/', authenToken, async (req, res, next) => {
    try {
        const { accountId1, accountId2 } = req.body

        const roomDoc = await findRoomOneToOne(accountId1, accountId2)
        if (roomDoc) {
            return res.send({ status: 'success', room: roomDoc, created: false })
        }

        const newRoomDoc = await roomService.create({
            roomName: '<room name>',
            members: [accountId1, accountId2],
        })

        await Promise.all([
            addRoomIntoRoomContainer(accountId1, newRoomDoc._id),
            addRoomIntoRoomContainer(accountId2, newRoomDoc._id)
        ])

        res.send({ status: 'success', room: newRoomDoc, created: true })
    } catch (error) {
        next(error)
    }
})

// get latest 20 message in room
router.get('/messages/:id', async (req, res, next) => {
    let { skip, limit } = req.query
    const { id } = req.params

    if (!limit) {
        limit = 30
    }

    if (!skip) {
        skip = 0
    }

    try {
        const messageDocs = await messageService.getAll({
            roomId: id
        })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)

        const messages = convertDocsToArrayObject(messageDocs)
        messages.reverse()

        res.send({ status: 'success', messages })
    } catch (error) {
        next(error)
    }
})

router.get('/:id', authenToken, async (req, res, next) => {
    const { id } = req.params
    try {
        const roomDoc = await roomService.getOne({ _id: id })
        res.send({ status: 'success', room: roomDoc })
    } catch (error) {
        next(error)
    }
})


async function findRoomOneToOne(accountId1, accountId2) {
    return await roomService.Room.findOne({
        members: {
            $size: 2,
            $all: [accountId1, accountId2]
        }
    })
}

async function addRoomIntoRoomContainer(accountId, roomId) {
    const accountDoc = await accountService.getOne({ _id: accountId })
    return await roomContainerService.RoomContainer.updateOne({
        _id: accountDoc.roomContainerId
    }, {
        $push: {
            rooms: roomId
        }
    })
}

module.exports = router