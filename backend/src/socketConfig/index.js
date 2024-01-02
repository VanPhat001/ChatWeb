const roomService = require("../services/roomService")
const messageService = require('../services/messageService')
const accountService = require("../services/accountService")


const socket2account = new Map()
const account2socket = new Map()

module.exports = (io, socket) => {
    console.log('👤🤝🤝🤝 Have a client connect to server, id ' + socket.id)

    socket.on('register-client-info', ({ accountId }) => {
        console.log(`👤 ▶️▶️ 🏠 Client register, socketId ${socket.id}, accountId ${accountId}`)
        socket2account.set(socket.id, accountId)
        account2socket.set(accountId, socket.id)

        accountService.updateOne({ _id: accountId }, { lastActive: null }, { allowNullFields: true })
            .then(data => {
                io.emit('client-online', { accountId })
            })
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
            .then(() => {
                io.emit('client-offline', { accountId })
            })
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

    socket.on('req-call', ({accountIdFrom, accountIdTo}) => {
        // console.log({accountIdFrom, accountIdTo})
        const socketIdTo = account2socket.get(accountIdTo)
        // console.log(account2socket)
        // console.log({accountIdFrom, accountIdTo, socketIdReceive})
        io.to(socketIdTo).emit('res-call', { accountIdFrom, accountIdTo })
    })

    socket.on('req-reject-call', ({ accountIdFrom, accountIdTo }) => {
        const socketIdFrom = account2socket.get(accountIdFrom)
        io.to(socketIdFrom).emit('res-reject-call', { accountIdFrom, accountIdTo })
    })

    socket.on('req-accept-call', ({ accountIdFrom, accountIdTo }) => {
        const socketIdFrom = account2socket.get(accountIdFrom)
        io.to(socketIdFrom).emit('res-accept-call', { accountIdFrom, accountIdTo })
    })

    socket.on('call-ready', ({ accountIdFrom, accountIdTo }) => {
        const socketIdFrom = account2socket.get(accountIdFrom)
        io.to(socketIdFrom).emit('call-ready', { accountIdFrom, accountIdTo })
    })

    socket.on('call-close', ({ partnerId }) => {
        const socketId = account2socket.get(partnerId)
        io.to(socketId).emit('call-close', {})
    })
}


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