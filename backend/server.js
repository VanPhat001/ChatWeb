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


// const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

// const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: '*'
});

io.on("connection", (socket) => {
    console.log('Have a client connect to server, id ' + socket.id)
})



app.use('/api', require('./src/router'))
app.use('/admin', require('./src/router/adminRouter'))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ status: 'error', msg: 'Something broke!' })
})



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