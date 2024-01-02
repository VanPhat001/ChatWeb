<style scoped>
.animation {
    border-radius: 50%;
    animation-name: animation;
    animation-duration: 4.8s;
    animation-iteration-count: infinite;
}

@keyframes animation {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>

<template>
    <div class="call-view fixed bg-blue-400 inset-0">
        <div v-if="waittingAccept" class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            <div class="relative">
                <Avatar class="m-auto border-[#ffffff52] border-[12px] rounded-full" :src="partner?.avatar" :size="120">
                </Avatar>

                <div
                    class="animation size-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white -z-10">
                </div>
                <div
                    class="animation size-[240px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white -z-10">
                </div>
                <div
                    class="animation size-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white -z-10">
                </div>
            </div>
            <p class="text-center text-2xl mt-3">
                {{ partner?.name }}
                <br>
                <span class="text-[80%] opacity-80">{{ 'Cuộc gọi đến...' }}</span>
            </p>
        </div>


        <video ref="remoteVideoEl"
            class="remote-video absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"></video>
        <video ref="localVideoEl" class="local-video absolute bottom-3 right-3 size-[25%] border-2"></video>

        <div class="absolute top-[84%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button class="p-3.5 rounded-full bg-white opacity-80 hover:opacity-100 mx-2.5" @click="toggleSound">
                <Icon height="28" icon="teenyicons:sound-off-solid" color="red" v-if="turnOnSound"></Icon>
                <Icon height="28" icon="teenyicons:sound-on-solid" color="blue" v-else></Icon>
            </button>
            <button class="p-3.5 rounded-full bg-white opacity-80 hover:opacity-100 mx-2.5" @click="toggleCamera">
                <Icon height="28" icon="fluent:video-off-24-filled" color="red" v-if="turnOnCamera"></Icon>
                <Icon height="28" icon="carbon:video-filled" color="blue" v-else></Icon>
            </button>
            <button class="p-3.5 rounded-full bg-white opacity-80 hover:opacity-100 mx-2.5" @click="rejectCall">
                <Icon height="28" icon="subway:call-3" color="red"></Icon>
            </button>
        </div>
    </div>
</template>


<script setup>
import Avatar from '@/components/Avatar.vue'
import { useAccountStore } from '@/stores/account'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { playIncommingCall, stopAudio } from '@/sounds'
import { useRoute, useRouter } from 'vue-router';
import { useAccountsStore } from '@/stores/accounts';
import axiosConfig from '@/axiosConfig';
import { useSocketStore } from '@/stores/socket';
import MediaCall from '@/peer/MediaCall'
import { opacityThreshold } from '@cloudinary/url-gen/actions/adjust';

const router = useRouter()
const route = useRoute()
const localVideoEl = ref(null)
const remoteVideoEl = ref(null)
const turnOnSound = ref(true)
const turnOnCamera = ref(true)
const waittingAccept = ref(true)
const partner = ref(null)
const partnerId = computed(() => route.params.partnerId)
const recevie = computed(() => route.query.recevie)
const mediaCall = window.mediaCall
const localStream = ref(null)
const remoteStream = ref(null)


const accountsStore = useAccountsStore()
const accountStore = useAccountStore()
const socketStore = useSocketStore()
let audio = null

socketStore.resAcceptCallActions.push(onRecipientAcceptCall)
socketStore.resRejectCallActions.push(onRecipientRejectCall)
socketStore.callReadyActions.push(onRecipientReadyCall)
socketStore.callCloseActions.push(onPartnerCloseCall)

onMounted(() => {
    mediaCall.onInitCallback = (stream) => {
        localStream.value = stream
        MediaCall.openVideo(localVideoEl.value, stream)
    }
    mediaCall.onStreamCallback = (stream) => {
        remoteStream.value = stream
        MediaCall.openVideo(remoteVideoEl.value, stream)
    }
})

onBeforeUnmount(() => {
    socketStore.resAcceptCallActions = socketStore.resAcceptCallActions.filter(func => func != onRecipientAcceptCall)
    socketStore.resRejectCallActions = socketStore.resRejectCallActions.filter(func => func != onRecipientRejectCall)
    socketStore.callReadyActions = socketStore.callReadyActions.filter(func => func != onRecipientReadyCall)
    socketStore.callCloseActions = socketStore.callCloseActions.filter(func => func != onPartnerCloseCall)
})

console.log(partnerId.value, recevie.value)
if (accountsStore.contain(partnerId.value)) {
    partner.value = accountsStore.get(partnerId.value)
} else {
    axiosConfig().get(`/account/${partnerId.value}`)
        .then(result => {
            partner.value = result.data.account
        })
        .catch(console.log)
}

if (recevie.value) {
    waittingAccept.value = false
    mediaCall.receive()
    socketStore.socket.emit('call-ready', {
        accountIdFrom: partnerId.value,
        accountIdTo: accountStore._id
    })
}


// setTimeout(() => {
//     waittingAccept.value = false
// }, 5000);

// watch(() => waittingAccept.value,
//     (newVal, oldVal) => stopAudio(audio))

// onMounted(() => {
//     setTimeout(() => {
//         audio = playIncommingCall()
//     }, 1000);
// })


function openSound() {

}

function closeSound() {
}

function openCamera() {
    localStream.value.style.opacity = 1
}

function closeCamera() {
    localStream.value.style.opacity = 0
}


function toggleSound() {
    turnOnSound.value = !turnOnSound.value

    if (turnOnSound) {
        openSound()
    } else {
        closeSound()
    }
}

function toggleCamera() {
    turnOnCamera.value = !turnOnCamera.value

    if (turnOnCamera) {
        openCamera()
    } else {
        closeCamera()
    }
}

function rejectCall() {    
    localStream.value?.getTracks().forEach(track => track.stop())
    remoteStream.value?.getTracks().forEach(track => track.stop())
    socketStore.socket.emit('call-close', { partnerId: partnerId.value })
    router.back()
}


//#region CALL --- CALLER SIDE
// caller side
function onPartnerCloseCall() {
    localStream.value?.getTracks().forEach(track => track.stop())
    remoteStream.value?.getTracks().forEach(track => track.stop())
    router.back()
}

// caller side
function onRecipientRejectCall() {
    router.back()
}

// caller side
function onRecipientAcceptCall() {
    waittingAccept.value = false
}


// caller side
function onRecipientReadyCall({ accountIdFrom, accountIdTo }) {
    mediaCall.call(accountIdTo)
    waittingAccept.value = false
}
//#endregion
</script>