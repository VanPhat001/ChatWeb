const jwt = require('jsonwebtoken')

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
        if (!auth) {
            return res.status(401).send({ status: 'error' })
        }

        const accessToken = auth.split(' ')[1]
        if (!accessToken) {
            return res.status(401).send({ status: 'error' })
        }

        jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, data) => {
            if (err) {
                return res.status(403).send({ status: 'error' })
            } else {
                req.data = data
                next()
            }
        })
    },

    convertDocsToArrayObject(docs) {
        return docs.map(doc => doc.toObject())
    }
}