const router = require('express').Router()
const jwt = require('jsonwebtoken')

const accountService = require('../services/accountService')
const { authenToken } = require('../helpers')

router.use('/account', require('./accountRouter'))
router.use('/roomContainer', require('./roomContainerRouter'))
router.use('/room', require('./roomRouter'))
router.use('/message', require('./messageRouter'))

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    try {
        const account = await accountService.getOne({ username, password })

        if (account) {
            const accessToken = jwt.sign(
                { _id: account._id, username },
                process.env.ACCESS_SECRET_TOKEN,
                { expiresIn: '7d' })
            res.send({ status: 'success', accessToken })
        } else {
            res.send({ status: 'error' })
        }

    } catch (error) {
        next(error)
    }
})

router.post('/verify', authenToken, (req, res) => {
    res.send({ status: 'success' })
})



module.exports = router