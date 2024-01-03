const router = require('express').Router()
const commentService = require('../services/commentService')
const postService = require('../services/postService')

router.post('/RESET', async (req, res, next) => {
    const task1 = commentService.delete({})
    const task2 = postService.Post.updateMany({}, {
        $set: {
            commentCount: 0
        }
    })

    try {
        await Promise.all([task1, task2])
        res.send({ status: 'success' })
    } catch (error) {
        next(error)
    }
})

// tạo mới comment và cập nhật số lượng commentCount của post tương ứng
router.post('/', async (req, res, next) => {
    const { accountId, postId, text, image, commentReplyId } = req.body

    try {
        const doc = await commentService.create({ accountId, postId, text, image, commentReplyId })
        await postService.Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 } })
        res.send({ status: 'success', comment: doc })
    } catch (error) {
        next(error)
    }
})

// lấy tất cả comment của post có _id = postId (có thể giới hạn số lượng và vị trí qua limit và skip)
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