const router = require('express').Router()
const commentService = require('../services/commentService')

router.post('/', async (req, res, next) => {
    const { accountId, postId, text, image, commentReplyId } = req.body

    try {
        const doc = await commentService.create({ accountId, postId, text, image, commentReplyId })
        res.send({ status: 'success', comment: doc })
    } catch (error) {
        next(error)
    }
})

router.get('/all/post/:postId', async (req, res, next) => {
    const { postId } = req.params
    let { limit, skip } = req.query

    limit = (!limit ? 10 : limit * 1)
    skip = (!skip ? 0 : skip * 1)

    try {
        const commentDocs = await commentService.getAll({ postId: postId })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)

        res.send({ status: 'success', comments: commentDocs })
    } catch (error) {
        next(error)
    }
})


module.exports = router