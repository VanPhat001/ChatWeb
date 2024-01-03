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

router.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const doc = await postService.getOne({ _id: id })
        res.send({ status: 'success', post: doc })
    } catch (error) {
        next(error)
    }
})

router.get('/author/:author', authenToken, async (req, res, next) => {
    const { author } = req.params
    let { skip, limit } = req.query

    if (!skip) {
        skip = 0
    }

    if (!limit) {
        limit = 10
    }

    try {
        const docs = await postService.getAll({ author: author })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)

        const posts = docs.filter(doc => doc.toObject())
        posts.reverse()

        res.send({ status: 'success', posts })
    } catch (error) {
        next(error)
    }
})

router.patch('/:id/account/:accountId/like', authenToken, async (req, res, next) => {
    const { id: postId, accountId } = req.params

    try {
        const result = await postService.Post.updateOne({
            _id: postId
        }, {
            $push: {
                likes: accountId
            }
        })

        res.send({ status: 'success', result })
    } catch (error) {
        next(error)
    }
})

router.patch('/:id/account/:accountId/unlike', authenToken, async (req, res, next) => {
    const { id: postId, accountId } = req.params

    try {
        const result = await postService.Post.updateOne({
            _id: postId
        }, {
            $pull: {
                likes: accountId
            }
        })

        res.send({ status: 'success', result })
    } catch (error) {
        next(error)
    }
})

async function getRoomContainer(accountId) {
    const accountDoc = await accountService.getOne({ _id: accountId })
    return await roomContainerService.getOne({ _id: accountDoc.roomContainerId })
}

module.exports = router