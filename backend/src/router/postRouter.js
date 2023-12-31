const router = require('express').Router()

const { authenToken } = require('../helpers')
const postService = require('../services/postService')
const accountService = require('../services/accountService')
const roomContainerService = require('../services/roomContainerService')

router.route('/')
    .get(authenToken, async (req, res, next) => {
        try {
            const postDocs = await postService.getAll()
            res.send({ status: 'success', posts: postDocs })
        } catch (error) {
            next(error)
        }
    })
    .post(authenToken, async (req, res, next) => {
        const { author, text, image } = req.body

        try {
            const postDoc = await postService.create({
                author,
                text,
                image
            })

            await getRoomContainer(author)

            res.send({ status: 'success', post: postDoc })
        } catch (error) {
            next(error)
        }
    })


async function getRoomContainer(accountId) {
    const accountDoc = await accountService.getOne({ _id: accountId })
    return await roomContainerService.getOne({ _id: accountDoc.roomContainerId })
}

module.exports = router