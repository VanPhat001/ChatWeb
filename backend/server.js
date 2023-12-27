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

const router = require('./src/router')
app.use('/api', router)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})



async function startServer() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatWebDB')
        console.log("✅✅ Connect to db successfully!!!")

        app.listen(port, () => console.log("Listen port " + port))
    } catch (error) {
        console.log("❌❌ Can't connect to db!!!")
        process.exit()
    }
}
startServer()