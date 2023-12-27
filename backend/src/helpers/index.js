module.exports = {
    removeNullProps(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === null) {
                delete obj[key]
            }
        })
    },

    removePasswordProp(obj) {
        delete obj['password']
    },

    authenToken(req, res, next) {
        const auth = req.headers.authorization
        const accessToken = auth.split(' ')[1]

        if (!accessToken) {
            res.status(401).send({ status: 'error' })
        }

        jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, data) => {
            if (err) {
                res.status(403).send({ status: 'error' })
            } else {
                req.data = data
                next()
            }
        })
    }
}