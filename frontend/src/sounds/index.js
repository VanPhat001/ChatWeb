function playSendMessageSound() {
    try {
        const audio = new Audio('/message-sound.mp3')
        audio.play()

        return audio
    } catch (error) {
        console.log(error)
        return null
    }
}

function playReceiveMessageSound() {
    try {
        const audio = new Audio('/message_received.mp3')
        audio.play()

        return audio
    } catch (error) {
        console.log(error)
        return null
    }
}

function playOpenMiniChatSound() {
    try {
        const audio = new Audio('/open-minichat-sound.mp3')
        audio.play()

        return audio
    } catch (error) {
        console.log(error)
        return null
    }
}

function playIncommingCall() {
    try {
        const audio = new Audio('/incomming-call.mp3')
        audio.play()

        audio.addEventListener('ended', () => {
            audio.play()
        })

        return audio
    } catch (error) {
        console.log(error)
        return null
    }
}

function stopAudio(audio) {
    audio.pause()
    audio.currentTime = 0
}

export {
    playSendMessageSound,
    playReceiveMessageSound,
    playIncommingCall,
    stopAudio,
    playOpenMiniChatSound
}