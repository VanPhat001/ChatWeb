const router = require('express').Router()

const { removePasswordProp } = require('../helpers')
const accountService = require('../services/accountService')
const friendContainerService = require('../services/friendContainerService')
const postContainerService = require('../services/postContainerService')
const requestAddFriendContainerService = require('../services/requestAddFriendContainerService')
const roomContainerService = require('../services/roomContainerService')

router.route('/')
    .post(async (req, res, next) => {
        const tasks = [
            friendContainerService.create(),
            postContainerService.create(),
            requestAddFriendContainerService.create(),
            roomContainerService.create()
        ]

        try {
            const [friend, post, requestAddFriend, room] = await Promise.all(tasks)

            const account = await accountService.create({
                ...req.body,
                roomContainerId: room._id,
                postContainerId: post._id,
                friendContainerId: friend._id,
                requestAddFriendContainerId: requestAddFriend._id
            })

            removePasswordProp(account)

            res.send({ status: 'success', data: account })
        } catch (error) {
            next(error)
        }
    })

module.exports = router