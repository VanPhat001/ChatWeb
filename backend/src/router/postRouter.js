const router = require('express').Router()

const { authenToken } = require('../helpers')
const postService = require('../services/postService')
const accountService = require('../services/accountService')
const roomContainerService = require('../services/roomContainerService')
const postContainerService = require('../services/postContainerService')
const commentService = require('../services/commentService')

router.post('/RESET', async (req, res, next) => {
    const task1 = postService.delete({})
    const task2 = commentService.delete({})
    const task3 = postContainerService.PostContainer.updateMany({}, {
        $set: {
            posts: []
        }
    })

    try {
        await Promise.all([task1, task2, task3])
        res.send({ status: 'success'})
    } catch (error) {
        next(error)
    }
})

router.route('/')
    // Lấy tất cả post
    .get(authenToken, async (_req, res, next) => {
        try {
            const postDocs = await postService.getAll()
            res.send({ status: 'success', posts: postDocs })
        } catch (error) {
            next(error)
        }
    })
    // Tạo bài post mới và thêm nó vào postContainer
    .post(authenToken, async (req, res, next) => {
        const { author, text, image } = req.body

        try {
            const postDoc = await postService.create({
                author,
                text,
                image
            })

            await addPostIntoPostContainer(author, postDoc._id)

            res.send({ status: 'success', post: postDoc })
        } catch (error) {
            next(error)
        }
    })

// lấy bài post theo id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const doc = await postService.getOne({ _id: id })
        res.send({ status: 'success', post: doc })
    } catch (error) {
        next(error)
    }
})

// lấy tất cả bài post theo id tác giả (author)
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

// thêm thành viên vào mảng likes của post với postId tương ứng
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

// xoá thành viên khỏi mảng likes của bài post với postid tương ứng
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


async function addPostIntoPostContainer(accountId, post) {
    const accountDoc = await accountService.getOne({ _id: accountId })
    await postContainerService.PostContainer.findOneAndUpdate({
        _id: accountDoc.postContainerId
    }, {
        $push: {
            posts: post
        }
    })
}

module.exports = router