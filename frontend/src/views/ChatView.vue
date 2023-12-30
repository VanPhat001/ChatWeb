<template>
    <div class="chat-view flex w-full h-full">
        <!-- room chat list -->
        <div class="sidebar w-[320px] border border-[--border] h-full flex flex-col">
            <!-- search box -->
            <div class="px-2 py-3">
                <div class="flex bg-[#3a3b3c] rounded-xl px-2 py-1">
                    <button>
                        <Icon icon="ic:round-search" height="24"></Icon>
                    </button>
                    <input type="text" class="flex-1 bg-transparent outline-none px-1" placeholder="Tìm kiếm">
                </div>
            </div>
            <!-- rooms -->
            <div class="flex-1 h-full overflow-y-auto px-2">
                <div class="room p-2 rounded-lg flex hover:bg-gray-600" v-for="(room, index) in rooms" :key="index"
                    @click="selectRoom(index)">
                    <img :src="getRoomAvatar(index)" alt="avatar" class="w-[56px] h-[56px] rounded-full">
                    <div class="flex-1 pl-2 flex flex-col justify-center">
                        <p>{{ room.roomName }}</p>
                        <div class="text-[80%] flex">
                            <p class="line-clamp-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita soluta
                                illo architecto id facere obcaecati ratione, blanditiis ipsa nesciunt repudiandae vel
                                voluptatum, placeat earum alias et in consequatur quibusdam iste!</p>
                            <p class="ml-auto whitespace-nowrap opacity-60">3 giờ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- box chat -->
        <BoxChat class="flex-1 border border-[--border]" @on-info="toggleInfoBox" :room-id="currentRoomId"></BoxChat>

        <!-- user info -->
        <div ref="infoEl" class="sidebar w-[260px] border border-[--border] transition-all overflow-hidden close">right
        </div>
    </div>
</template>

<style scoped>
.close {
    width: 0 !important;
}
</style>

<script setup>
import axiosConfig from '@/axiosConfig';
import BoxChat from '@/components/BoxChat.vue'
import { useAccountStore } from '@/stores/account';
import { useAccountsStore } from '@/stores/accounts'
import { useRoomsStore } from '@/stores/rooms';
import { Icon } from '@iconify/vue'
import { computed, inject, ref } from 'vue'

const infoEl = ref(null)
const rooms = ref([])
const accounts = ref([])
const currentRoomIndex = ref(-1)
const cookies = inject('$cookies')
const accessToken = cookies.get('access_token')
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const roomsStore = useRoomsStore()

// currentRoom = null if user no select room (currentRoomIndex = -1) otherwise currentRoom = roomId
const currentRoomId = computed(() => {
    const roomIndex = currentRoomIndex.value
    return roomIndex == -1 ? null : rooms.value[roomIndex]._id
})

console.log({ tookenInRoom: cookies.get('access_token') })
console.log({ default: axiosConfig().defaults })
axiosConfig().get('/roomContainer')
    .then(async result => {
        const _rooms = result.data.rooms

        let allMembers = []
        _rooms.forEach(room => {
            allMembers = allMembers.concat(room.members)
        })

        const accountIdSet = new Set(allMembers)
        let _accounts = []
        accountIdSet.forEach(accountId => {
            if (accountsStore.contain(accountId)) {
                accountIdSet.delete(accountId)
                _accounts.push(accountsStore.get(accountId))

            }
        })
        _accounts = _accounts.concat(await fetchAccounts([...accountIdSet]))

        roomsStore.addMany(_rooms)
        accountsStore.addMany(_accounts)

        accounts.value = _accounts
        rooms.value = _rooms
    })
    .catch(err => console.log(err))


async function fetchAccounts(accountIdArray) {
    const result = await axiosConfig().post('/account/list', {
        accountIdArray
    })
    return result.data.accounts
}


function toggleInfoBox() {
    if (infoEl.value.classList.contains('close')) {
        infoEl.value.classList.remove('close')
    } else {
        infoEl.value.classList.add('close')
    }
}

function getAccount(id) {
    for (let i = 0; i < accounts.value.length; i++) {
        if (accounts.value[i]._id == id) {
            return accounts.value[i]
        }
    }
}

function getRoomAvatar(index) {
    const room = rooms.value[index]
    if (room.avatar) {
        return room.avatar
    }

    const memIndex = room.members[0] == accountStore._id ? 1 : 0
    const accountId = room.members[memIndex]

    return getAccount(accountId).avatar
}

function selectRoom(index) {
    console.log('select room ' + index)
    currentRoomIndex.value = index
}
</script>