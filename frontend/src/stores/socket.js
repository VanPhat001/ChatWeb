import { defineStore } from "pinia"
import { io } from "socket.io-client"
import { ref } from "vue"


export const useSocketStore = defineStore('socket', () => {
    const socket = ref(null)
    const resSendMessageActions = []
    const clientOnlineActions = []
    const clientOfflineActions = []

    function connectToSocketServer() {
        if (socket.value !== null) {
            return
        }

        const _socket = io("http://localhost:4193")

        _socket.on("connect", () => {
            console.log(_socket.id);
            socket.value = _socket
        })

        _socket.on("disconnect", () => {
            // console.log(_socket.id);
            socket.value = null
        })

        _socket.on('client-online', data => {
            clientOnlineActions.forEach(func => func(data))
        })

        _socket.on('client-offline', data => {
            clientOfflineActions.forEach(func => func(data))
        })

        _socket.on('res-send-message', data => {
            resSendMessageActions.forEach(func => func(data))
        })
    }

    function registerClientInfo(accountId) {
        if (socket.value === null) {
            console.log('socket is null')
            return
        }

        socket.value.emit('register-client-info', { accountId })
    }

    return {
        socket, resSendMessageActions, clientOnlineActions, clientOfflineActions,
        connectToSocketServer,
        registerClientInfo,
    }
})