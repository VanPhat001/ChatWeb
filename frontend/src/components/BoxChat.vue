<template>
    <div class="box-chat h-full w-full flex flex-col">

        <template v-if="roomId === null">
            <p class="m-auto select-none">
                no message, please select chat room before this action
            </p>
        </template>

        <template v-else>
            <div class="box-top p-2 flex items-center">
                <!-- info -->
                <div class="flex">
                    <!-- <img :src="roomAvatar" alt="avatar" class="w-[40px] h-[40px] rounded-full inline-block"> -->
                    <Avatar :size="40" :src="room.avatar" :active="false" :bottom-percent="-4" :right-percent="-4">
                    </Avatar>

                    <div class="px-2">
                        <p>{{ room.roomName }}</p>
                        <p class="text-[10px] opacity-75">{{ activeTimeString() }}</p>
                    </div>
                </div>

                <!-- controls -->
                <div class="ml-auto">
                    <button @click="onCallClick" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700">
                        <Icon icon="material-symbols:call" height="22"></Icon>
                    </button>
                    <button @click="onCameraClick" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700 ml-1">
                        <Icon icon="jam:video-camera-f" height="22"></Icon>
                    </button>
                    <button @click="onInfoClick" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700 ml-1">
                        <Icon icon="jam:info-f" height="22"></Icon>
                    </button>
                </div>
            </div>

            <!-- messages -->
            <div ref="messageListEl" @scroll="onMessageListScroll(this)"
                class="box-middle border border-[--border] h-full overflow-y-auto p-2">
                <div class="message flex mb-1" v-for="(item, index) in messages" :key="index">
                    <template v-if="item.sender != accountStore._id">
                        <div class="avatar-box w-[32px] h-[32px]">
                            <!-- <img :src="accountsStore.get(item.sender).avatar" class="w-full h-full rounded-full"
                                alt="avatar" v-if="showAvatar(index)"> -->

                            <Avatar :active="false" :src="accountsStore.get(item.sender).avatar" :size="32"
                                v-if="showAvatar(index)"></Avatar>
                        </div>
                        <p class="mx-2 max-w-[66%] bg-[#303030] px-3 py-1 rounded-xl"
                            :title="`${new Date(item.createdAt).toLocaleString()}`">{{ item.text }}</p>
                    </template>

                    <template v-else>
                        <p class="ml-auto max-w-[66%] bg-[#0084ff] px-3 py-1 rounded-xl"
                            :title="`${new Date(item.createdAt).toLocaleString()}`">{{ item.text }}</p>
                    </template>
                </div>

                <div ref="hiddenEl" class="h-0"></div>
            </div>

            <!-- input box -->
            <div class="box-bottom flex p-2 items-center">
                <textarea v-model="text" autofocus @keydown.enter.prevent="sendMessage" rows="1"
                    class="outline-none resize-none flex-1 px-2 py-1 bg-[#3a3b3c] rounded-xl"
                    placeholder="Enter to submit..."></textarea>
                <button @click="sendMessage" class="px-2 py-1 text-[#0084ff] hover:bg-gray-700 ml-1 rounded-md">
                    <Icon icon="material-symbols:send-rounded" height="24"></Icon>
                </button>
            </div>
        </template>

    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig'
import { useAccountStore } from '@/stores/account'
import { useAccountsStore } from '@/stores/accounts'
import { useRoomsStore } from '@/stores/rooms'
import { useSocketStore } from '@/stores/socket'
import { Icon } from '@iconify/vue'
import { computed, inject, onBeforeUnmount, onBeforeUpdate, onUpdated, ref, watch } from 'vue'
import { playSendMessageSound } from '@/sounds'
import Avatar from './Avatar.vue'
import { getDifferenceBetween2Date } from '@/helpers'
import router from '@/router'


// clock.register(() => {
//     console.log(new Date().toLocaleString())
// })


const emits = defineEmits(['on-call', 'on-camera', 'on-info'])
const roomsStore = useRoomsStore()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const socketStore = useSocketStore()

const props = defineProps({
    roomId: {
        required: true
    }
})

const hiddenEl = ref(null)
const messageListEl = ref(null)
const segment = ref(0)
const isLoadingData = ref(false)
const allowScrollToBottom = ref(true)
const room = ref(null)
const text = ref('')
const roomAvatar = ref('')
const messages = ref([])
const roomId = computed(() => props.roomId)
const socket = computed(() => socketStore.socket)

initData()
socketStore.resSendMessageActions.push(receiveMessageFromSocketServer)

onBeforeUpdate(() => {
    if (messageListEl.value === null) {
        return
    }

    const { scrollTop, scrollHeight, clientHeight } = messageListEl.value
    allowScrollToBottom.value = (scrollHeight - scrollTop == clientHeight)
})

onUpdated(() => {
    if (allowScrollToBottom.value) {
        hiddenEl.value?.scrollIntoView({ behavior: 'smooth' })
    }
})

watch(roomId, (newVal, oldVal) => {
    if (newVal != oldVal) {
        initData()
    }
})

onBeforeUnmount(() => {
    const index = socketStore.resSendMessageActions.indexOf(receiveMessageFromSocketServer)
    if (index != -1) {
        socketStore.resSendMessageActions.splice(index, 1)
    }
})

async function initData(_limit = 20) {
    if (roomId.value === null) {
        return
    }

    updateRoomInfo(roomId.value)
    room.value = roomsStore.get(roomId.value)

    const result = await axiosConfig().get(`/room/messages/${roomId.value}?limit=30`)
    messages.value = result.data.messages
}


function sendMessage() {
    if (!text.value.trim()) {
        return
    }

    try {
        socket.value.emit('req-send-message', {
            sender: accountStore._id,
            roomId: roomId.value,
            text: text.value
        })

        playSendMessageSound()
    } catch (error) {
        console.log(error)
    }

    text.value = ''
}

function receiveMessageFromSocketServer(msg) {
    if (msg.roomId != roomId.value) {
        return
    }

    // already solved in ChatView.vue file
    // if (msg.sender != accountStore._id) {
    //     playReceiveMessageSound()
    // }

    // console.log({msg})
    messages.value.push(msg)
}

function showAvatar(index) {
    return index == 0 || messages.value[index - 1].sender != messages.value[index].sender
}

function continueFetchMessage() {
    axiosConfig().get(`/room/messages/${roomId.value}?skip=${30 * segment.value}&limit=${30}`)
        .then(result => {
            const { messages: _messages } = result.data
            messages.value = _messages.concat(messages.value)
        })
        .catch(err => {
            console.log(err)
            segment.value--
        })
        .finally(() => {
            isLoadingData.value = false
        })
}

function onMessageListScroll() {
    const { scrollTop } = messageListEl.value
    // console.log(scrollHeight - scrollTop, clientHeight)

    if (scrollTop === 0 && !isLoadingData.value) {
        console.log('continue fetch message, segment ' + segment.value)
        isLoadingData.value = true
        segment.value++
        continueFetchMessage()
    }
}

function activeTimeString() {
    const members = room.value.members
    if (members.length > 2) {
        for (let i = 0; i < members.length; i++) {
            const account = accountsStore.get(members[i])
            if (account && account.lastActive === null) {
                return 'Đang hoạt động'
            }
        }
    } else {
        const anotherAccount = members[0] === accountStore._id ? members[1] : members[0]
        const account = accountsStore.get(anotherAccount)
        if (account) {
            if (account.lastActive === null) {
                return 'Đang hoạt động'
            } else {
                const str = getDifferenceBetween2Date(new Date(), new Date(account.lastActive))
                return (str == 'vừa xong' ? 'Đang hoạt động' : `Hoạt động ${str}`)
            }
        }
        return ''
    }
}

function startCall() {
    // const mediaCall = window.mediaCall
    // console.log({ mediaCall })
    const members = room.value.members
    const anotherMember = members[0] == accountStore._id ? members[1] : members[0]

    socket.value.emit('req-call', {
        accountIdFrom: accountStore._id,
        accountIdTo: anotherMember
    })
    router.push({ name: 'call', params: { partnerId: anotherMember } })
}

function onCallClick() {
    startCall()
    emits('on-call')
}

function onCameraClick() {
    startCall()
    emits('on-camera')
}

function onInfoClick() {
    emits('on-info')
}

function updateRoomInfo(roomId) {
    const _room = roomsStore.get(roomId)

    // room chat contain 2 account
    // or this problem has solved at chatview.vue
    if (!_room.avatar) {
        const members = _room.members
        const partnerId = (members[0] == accountStore._id ? members[1] : members[0])
        const account = accountsStore.get(partnerId)
        _room.avatar = account.avatar
        _room.roomName = account.name

        roomsStore.roomMap.set(roomId, _room)
    }
    else {
        // room chat contain at least 2 account
        // available avatar and room name
    }
}

</script>