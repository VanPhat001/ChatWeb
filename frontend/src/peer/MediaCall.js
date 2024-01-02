import { Peer } from 'peerjs'

class MediaCall {
    static getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    
    constructor(id, openCallback = (mediaCall) => { }) {
        this.peerId = id
        this.onInitCallback = (stream) => { }
        this.onStreamCallback = (stream) => { }
        this.peer = new Peer(id)
        this.peer.on('open', id => {
            openCallback(this)
        })
    }

    static openVideo(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
    }

    call(partnerId) {
        MediaCall.getUserMedia({ video: true, audio: true }, stream => {
            this.onInitCallback(stream)
            // this.openVideo(localVideo, stream)

            const call = this.peer.call(partnerId, stream)
            call.on('stream', remoteStream => {

                this.onStreamCallback(remoteStream)
                // this.openVideo(remoteVideo, remoteStream)

            })
        }, err => {
            console.log('Failed to get local stream', err)
        })
    }

    receive() {
        this.peer.on('call', (call) => {
            MediaCall.getUserMedia({ video: true, audio: true }, stream => {

                this.onInitCallback(stream)
                // openVideo(localVideo, stream)

                call.answer(stream) // Answer the call with an A/V stream.
                call.on('stream', remoteStream => {

                    this.onStreamCallback(remoteStream)
                    // openVideo(remoteVideo, remoteStream)

                })
            }, err => {
                console.log('Failed to get local stream', err)
            })
        })
    }
}

export default MediaCall