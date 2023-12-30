require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// ======================== socket config ========================
const { createServer } = require("http")
const { Server } = require("socket.io")
const httpServer = createServer(app)
const socketConfig = require('./src/socketConfig')
const io = new Server(httpServer, {
    cors: '*'
})

io.on("connection", socket => socketConfig(io, socket))


// ======================== nodejs config ========================
app.use((req, res, next) => {
    process.stdout.write(`[${new Date().toLocaleString()}] `)
    next()
})

app.use('/api', require('./src/router'))
app.use('/admin', require('./src/router/adminRouter'))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ status: 'error', msg: 'Something broke!' })
})


// ======================== start server ========================
async function startServer() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatWebDB')
        console.log("✅✅ Connect to db successfully!!!")

        // app.listen(port, () => console.log("Listen port " + port))
        httpServer.listen(port, () => console.log("Listen port " + port))
    } catch (error) {
        console.log("❌❌ Can't connect to db!!!")
        process.exit()
    }
}
startServer()