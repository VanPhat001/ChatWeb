<template>
    <div class="box-chat h-full w-full flex flex-col">

        <template v-if="roomId === null">
            <p class="m-auto">
                no message, please select chat room before this action
            </p>
        </template>

        <template v-else>
            <div class="box-top p-2 flex items-center">
                <!-- info -->
                <div class="flex">
                    <img :src="roomAvatar" alt="avatar"
                        class="w-[40px] h-[40px] rounded-full inline-block">
                    <div class="px-2">
                        <p>{{ room.roomName }}</p>
                        <p class="text-[10px] opacity-75">Hoạt động 4 giờ trước</p>
                    </div>
                </div>

                <!-- controls -->
                <div class="ml-auto">
                    <button @click="emits('on-call')" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700">
                        <Icon icon="material-symbols:call" height="22"></Icon>
                    </button>
                    <button @click="emits('on-camera')" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700 ml-1">
                        <Icon icon="jam:video-camera-f" height="22"></Icon>
                    </button>
                    <button @click="emits('on-info')" class="text-[#0084ff] px-3 py-2 rounded-md hover:bg-gray-700 ml-1">
                        <Icon icon="jam:info-f" height="22"></Icon>
                    </button>
                </div>
            </div>

            <!-- messages -->
            <div class="box-middle border border-[--border] h-full overflow-y-auto p-2">
                <div class="message flex mb-1" v-for="(item, index) in messages" :key="index">
                    <template v-if="item.sender != author">
                        <div class="avatar-box w-[32px] h-[32px]">
                            <img src="https://cdn.waifu.im/7478.jpg" class="w-full h-full rounded-full" alt="avatar"
                                v-if="showAvatar(index)">
                        </div>
                        <p class="mx-2 max-w-[66%] bg-[#303030] px-3 py-1 rounded-xl">{{ item.text }}</p>
                    </template>

                    <template v-else>
                        <p class="ml-auto max-w-[66%] bg-[#303030] px-3 py-1 rounded-xl">{{ item.text }}</p>
                    </template>
                </div>
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
import axios from '@/axiosConfig'
import { useAccountStore } from '@/stores/account'
import { useAccountsStore } from '@/stores/accounts'
import { useRoomsStore } from '@/stores/rooms'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'

const emits = defineEmits(['on-call', 'on-camera', 'on-info'])
const roomsStore = useRoomsStore()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const props = defineProps({
    roomId: {
        required: true
    }
})
const room = ref(null)
const text = ref('')
const roomAvatar = ref('')
const messages = ref([])
const roomId = computed(() => props.roomId)

watch(roomId, (newVal, oldVal) => {
    if (newVal != oldVal) {
        initData()
    }
})

initData()





async function initData(limit = 20) {
    room.value = roomsStore.get(roomId.value)
    updateRoomAvatar()

    const result = await axios.get(`/room/${roomId.value}`)
    messages.value = result.data.messages
}


// const author = 1
// const messagesTest = ref([
//     {
//         sender: 1,
//         text: 'hihi'
//     },
//     {
//         sender: 2,
//         text: 'hihi'
//     }
// ])

function updateRoomAvatar() {
    if (!room.value) {
        return
    }

    const { avatar, members } = room.value
    
    if (avatar) {
        roomAvatar.value = avatar
        return
    }

    const anotherPersonId = (members[0] == accountStore._id ? members[1] : members[0])
    roomAvatar.value = accountsStore.get(anotherPersonId).avatar
}

function sendMessage() {
    console.log({ text: text.value })
}

function showAvatar(index) {
    return index == 0 || messagesTest.value[index - 1].sender != messagesTest.value[index].sender
}

</script>