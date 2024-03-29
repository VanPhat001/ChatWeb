<template>
    <div class="chat-view flex w-full h-full">
        <!-- room chat list -->
        <div class="sidebar w-[320px] border border-[--border] h-full flex flex-col">
            <!-- search box -->
            <div class="px-2 py-3 flex">
                <button class="px-2 hover:bg-gray-700 mr-1 rounded-lg" @click="showResultBox = false"
                    v-show="showResultBox">
                    <Icon icon="lets-icons:back" height="24"></Icon>
                </button>
                <div class="flex flex-1 bg-[#3a3b3c] rounded-xl px-2 py-1">
                    <button disabled>
                        <Icon icon="ic:round-search" height="24"></Icon>
                    </button>
                    <input type="text" v-model="searchText" class="flex-1 bg-transparent outline-none px-1"
                        placeholder="Tìm kiếm">
                </div>
            </div>

            <!-- result box -->
            <AccountList v-show="showResultBox" :account-id-list="searchResultArray"
                @on-select-account-id="createRoomIfNotExist"></AccountList>

            <!-- rooms -->
            <div v-show="!showResultBox" class="flex-1 h-full overflow-y-auto px-2">
                <template v-for="(roomId, index) in roomIdArray" :key="index">
                    <div class="room relative p-2 rounded-lg flex hover:bg-gray-600 pr-8" :set="room = roomMap.get(roomId)"
                        @click="selectRoom(roomId)">
                        <div v-show="!room.seen"
                            class="rounded-full w-3 h-3 bg-blue-600 absolute top-1/2 right-1 -translate-x-1/2 -translate-y-1/2">
                        </div>

                        <!-- <img :src="getRoomAvatar(index)" alt="avatar" class="w-[56px] h-[56px] rounded-full"> -->
                        <Avatar :size="56" :src="getRoomAvatar(roomId)" :active="isRoomOnline(roomId)"></Avatar>
                        <div class="flex-1 pl-2 flex flex-col justify-center">
                            <p>{{ room.roomName }}</p>
                            <div class="text-[80%] flex opacity-60" :class="{ '!opacity-100': !room.seen }">
                                <p class="line-clamp-1" v-if="room.latestMessage?.text">{{ room.latestMessage?.text }}</p>
                                <p v-else-if="room.latestMessage?.image">[hình ảnh]</p>
                                <p class="ml-auto whitespace-nowrap">{{ getDifferenceBetween2Date(new Date(), new Date(room.latestMessage?.createdAt)) }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- box chat -->
        <BoxChat class="flex-1 border border-[--border]" @click="onFocusBoxChat" @on-info="toggleInfoBox"
            :room-id="currentRoomId"></BoxChat>

        <!-- user info -->
        <div ref="infoEl" class="sidebar w-[260px] border border-[--border] transition-all overflow-y-auto close"
            v-if="currentRoomId" :set="accountInfo = getRoomInfo()">
            <Avatar class="m-auto mt-4" :size="96" :src="accountInfo.avatar"></Avatar>
            <p class="text-center text-2xl mt-2">{{ accountInfo.name }}</p>
            
            <p>Id: {{ accountInfo._id }}</p>
            <p>Username: {{ accountInfo.username }}</p>
            <p>Gender: {{ accountInfo.gender }}</p>
        </div>
    </div>
</template>

<style scoped>
.close {
    width: 0 !important;
}
</style>

<script setup>
import axiosConfig from '@/axiosConfig'
import Avatar from '@/components/Avatar.vue'
import AccountList from '@/components/AccountList.vue'
import BoxChat from '@/components/BoxChat.vue'
import { playReceiveMessageSound } from '@/sounds'
import { useAccountStore } from '@/stores/account'
import { useAccountsStore } from '@/stores/accounts'
import { useRoomsStore } from '@/stores/rooms'
import { useSocketStore } from '@/stores/socket'
import { Icon } from '@iconify/vue'
import { computed, inject, onBeforeUnmount, onBeforeUpdate, ref, watch } from 'vue'
import Debounce from '../helpers/Debounce'
import { getDifferenceBetween2Date } from '@/helpers'


const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const roomsStore = useRoomsStore()
const socketStore = useSocketStore()
const infoEl = ref(null)
const roomIdSet = ref(new Set())
const accountIdSet = ref(new Set())
const searchResultArray = ref([])
const showResultBox = ref(false)
const currentRoomId = ref(null)
const searchText = ref('')


const accountMap = computed(() => accountsStore.accountMap)
const roomMap = computed(() => roomsStore.roomMap)
const roomIdArray = computed(() => {
    const returnData = []
    const roomTemp = []

    roomIdSet.value.forEach(roomId => {
        const room = roomsStore.get(roomId)
        const latestMessage = room.latestMessage

        if (latestMessage) {
            roomTemp.push({ roomId, createdAt: latestMessage.createdAt })
        } else {
            returnData.push(roomId)
        }
    })
    
    roomTemp.sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
    })

    return returnData.concat(roomTemp.map(item => item.roomId))
})

const debounce = new Debounce(() => {
    findAccountsByRegex()
}, 300)

watch(() => searchText.value, (__) => {
    debounce.reStart()
})


onBeforeUnmount(() => {
    let index = socketStore.resSendMessageActions.indexOf(receiveMessageFromSocketServer)
    if (index != -1) {
        socketStore.resSendMessageActions.splice(index, 1)
    }

    index = socketStore.resSendMessageActions.indexOf(clientOnline)
    if (index != -1) {
        socketStore.resSendMessageActions.splice(index, 1)
    }

    index = socketStore.resSendMessageActions.indexOf(clientOffline)
    if (index != -1) {
        socketStore.resSendMessageActions.splice(index, 1)
    }
})

// console.log({ tookenInRoom: cookies.get('access_token') })
// console.log({ default: axiosConfig().defaults })
axiosConfig().get('/roomContainer')
    .then(async result => {
        const _rooms = result.data.rooms

        let allMembers = []
        _rooms.forEach(room => {
            allMembers = allMembers.concat(room.members)
            room.seen = true
        })

        const latestMessages = await fetchLatestMessages(_rooms.map(room => room.latestMessageId))
        latestMessages.forEach(msg => {
            if (msg === null) {
                return
            }

            for (let i = 0; i < _rooms.length; i++) {
                if (_rooms[i]._id == msg.roomId) {
                    _rooms[i].latestMessage = msg
                    break
                }
            }
        })

        const _accountIdSet = new Set(allMembers)
        let _accounts = []
        _accountIdSet.forEach(accountId => {
            if (accountsStore.contain(accountId)) {
                _accountIdSet.delete(accountId)
                _accounts.push(accountsStore.get(accountId))
            }
        })
        _accounts = _accounts.concat(await fetchAccounts([..._accountIdSet]))

        _rooms.forEach((room, index) => {
            if (room.isRoom) {
                return
            }

            const members = room.members
            const partnerId = (members[0] == accountStore._id ? members[1] : members[0])
            let account = accountsStore.get(partnerId)

            if (!account) {
                account = _accounts.filter(item => item._id == partnerId)[0]
            }

            room.roomName = account.name
            room.avatar = account.avatar

            _rooms[index] = room
        })

        roomsStore.addMany(_rooms)
        accountsStore.addMany(_accounts)
        accountIdSet.value = new Set(allMembers)
        roomIdSet.value = _rooms.map(room => room._id)

        // console.log({accountIdSet, roomIdSet})

        socketStore.resSendMessageActions.push(receiveMessageFromSocketServer)
        socketStore.clientOnlineActions.push(clientOnline)
        socketStore.clientOfflineActions.push(clientOffline)
    })
    .catch(err => console.log(err))


function findAccountsByRegex() {
    if (searchText.value == '') {
        return
    }

    console.log('>> find account by regex')
    axiosConfig().get(`/account/name/regex/${searchText.value}`)
        .then(result => {
            const { accounts } = result.data
            accountsStore.addMany(accounts)
            showResultBox.value = true
            searchResultArray.value = accounts.map(account => account._id)
        })
        .catch(console.log)
}

function createRoomIfNotExist({ accountId }) {
    console.log('click accountId ' + accountId)

    axiosConfig().post('/room', {
        accountId1: accountId,
        accountId2: accountStore._id
    })
        .then(result => {
            const { room, created } = result.data
            console.log(result.data)
            if (created) {
                roomsStore.addOne(room)
                roomIdSet.value = new Set([...roomIdSet.value, room._id])
                searchText.value = ''
                showResultBox.value = false
            } else {

            }
        })
        .catch(console.log)
}


async function fetchLatestMessages(latestMessageIdArray) {
    const result = await axiosConfig().post('/message/latest', {
        latestMessageIdArray
    })
    return result.data.latestMessages
}

async function fetchAccounts(accountIdArray) {
    const result = await axiosConfig().post('/account/list', {
        accountIdArray
    })
    return result.data.accounts
}

// async function fetchAccount(accountId) {
//     const result = await axiosConfig().get(`/account/${accountId}`)
//     return result.data.account
// }

async function fetchDataNewRoom(roomId) {
    const result = await axiosConfig().get(`/room/${roomId}`)
    const { room } = result.data

    const [latestMessage, accounts] = await Promise.all([
        fetchLatestMessages([room.latestMessageId]),
        fetchAccounts(room.members)
    ])

    room.seen = false
    room.latestMessageId = latestMessage._id
    room.latestMessage = latestMessage
    roomMap.value.set(roomId, room)
    accountsStore.addMany(accounts)
}

function toggleInfoBox() {
    if (infoEl.value.classList.contains('close')) {
        infoEl.value.classList.remove('close')
    } else {
        infoEl.value.classList.add('close')
    }
}

function getAccountById(accountId) {
    return accountMap.value.get(accountId)
}

function isRoomOnline(roomId) {
    const members = roomMap.value.get(roomId).members

    for (let i = 0; i < members.length; i++) {
        const accountId = members[i]
        const account = getAccountById(accountId)
        if (account.lastActive === null && account._id != accountStore._id) {
            return true
        }
    }

    return false
}

function getRoomAvatar(roomId) {
    const room = roomMap.value.get(roomId)
    if (room.avatar) {
        return room.avatar
    }

    const memIndex = room.members[0] == accountStore._id ? 1 : 0
    const accountId = room.members[memIndex]

    return getAccountById(accountId).avatar
}

function getRoomInfo() {
    if (!currentRoomId.value) {
        return
    }

    const room = roomMap.value.get(currentRoomId.value)
    const accountIds = room.members.filter(accountId => accountId != accountStore._id)
    const account = accountMap.value.get(accountIds[0])
    return account
}

function selectRoom(roomId) {
    currentRoomId.value = roomId
    console.log('user select roomId ' + roomId)
    userSeenMessageInRoom(roomId)
}

function onFocusBoxChat() {
    if (currentRoomId.value) {
        userSeenMessageInRoom(currentRoomId.value)
    }
}

function userSeenMessageInRoom(roomId) {
    if (!roomId) {
        return
    }

    const room = roomMap.value.get(roomId)
    room.seen = true
    roomMap.value.set(roomId, room)
}

function clientOnline({ accountId }) {
    accountsStore.setAccountOnline(accountId)
}

function clientOffline({ accountId }) {
    accountsStore.setAccountOffline(accountId)
}

async function receiveMessageFromSocketServer(message) {
    const { sender, roomId, _id } = message
    // console.log({ sender, roomId, text })

    let seen = false
    if (sender != accountStore._id) {
        playReceiveMessageSound()
    } else {
        seen = true
    }

    if (!roomMap.value.has(roomId)) {
        await fetchDataNewRoom(roomId)
        roomIdSet.value = new Set([...roomIdSet.value, roomId])
    }

    // update room.latestMessageId & room.latestMessage
    const room = roomMap.value.get(roomId)
    room.latestMessageId = _id
    room.latestMessage = message
    room.seen = seen
    roomMap.value.set(roomId, room)
}
</script>