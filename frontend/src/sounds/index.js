function playSendMessageSound() {
    try {
        const audio = new Audio('/message-sound.mp3')
        audio.play()
    } catch (error) {
        console.log(error)
    }
}

function playReceiveMessageSound() {
    try {
        const audio = new Audio('/message_received.mp3')
        audio.play()
    } catch (error) {
        console.log(error)
    }
}
export { playSendMessageSound, playReceiveMessageSound }