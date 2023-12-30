const roomService = require("../services/roomService")
const messageService = require('../services/messageService')
const accountService = require("../services/accountService")


const socket2account = new Map()
const account2socket = new Map()


async function createMessage(sender, roomId, text) {
    try {
        const messageDoc = await messageService.create({
            sender,
            roomId,
            text
        })

        await roomService.updateOne(roomId, {
            latestMessageId: messageDoc._id
        })

        return messageDoc.toObject()
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = (io, socket) => {
    console.log('👤🤝🤝🤝 Have a client connect to server, id ' + socket.id)

    socket.on('register-client-info', ({ accountId }) => {
        console.log(`👤 ▶️▶️ 🏠 Client register, socketId ${socket.id}, accountId ${accountId}`)
        socket2account.set(socket.id, accountId)
        account2socket.set(accountId, socket.id)

        accountService.updateOne(accountId, {
            lastActive: null
        })
        // .then()
        .catch(console.log)
    })

    socket.on("disconnect", (reason) => {
        console.log('◀️◀️ 👤🏠 Socket disconnected, id = ' + socket.id)
        const accountId = socket2account.get(socket.id)
        socket2account.delete(socket.id)
        account2socket.delete(accountId)

        accountService.updateOne(accountId, {
            lastActive: Date.now()
        })
        // .then()
        .catch(console.log)
    })



    socket.on('req-send-message', async ({ sender, roomId, text }) => {
        try {
            console.log('📩📩 incomming message: ' + text)

            const tasks = [
                roomService.getOne({ _id: roomId }),
                createMessage(sender, roomId, text)
            ]

            const [roomDoc, message] = await Promise.all(tasks)
            // console.log({message})
            if (message === null) {
                return
            }

            roomDoc.members.forEach(accountId => {
                const socketId = account2socket.get(accountId)

                if (socketId === undefined) {
                    console.log(`accountId ${accountId} cannot convert to socketId`)
                    return
                }

                io.to(socketId).emit('res-send-message', message)
            })

        } catch (error) {
            console.log(error)
        }
    })

}