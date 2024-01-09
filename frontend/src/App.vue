<style scoped>
.animation-appear {
  animation-name: appear;
  animation-duration: .4s;
  animation-iteration-count: 1;
}

.animation-close {
  animation-name: close;
  animation-duration: .4s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
}

@keyframes appear {
  from {
    height: 0;
  }
}

@keyframes close {
  to {
    height: 0;
    border-width: 0;
  }
}
</style>


<template>
  <div class="w-screen h-screen">
    <header ref="headerEl">
      <Navbar v-show="showNavbar"></Navbar>
    </header>
    <main ref="mainEl">
      <RouterView></RouterView>
      <!-- <NuxtWelcome /> -->
    </main>
    <Loading :class="{ 'hidden': !showLoading }"></Loading>
    <IncommingCall @on-accept="onAcceptCall" @on-reject="onRejectCall" v-if="showIncommingCall"
      class="fixed top-5 left-1/2 -translate-x-1/2"></IncommingCall>

    <!-- 6599b9548d592c4bf98a5f04 -->
    <BoxChat v-if="!['login', 'call', 'chat'].includes(route.name) && isDisplayMiniChat"
      class="animation-appear fixed bottom-0 right-20 w-[340px] h-[400px] border-blue-400 border rounded-md bg-black"
      :room-id="miniChatId" :info-icon="'mingcute:close-fill'" @on-info="closeMiniChat"></BoxChat>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeMount, onMounted, provide, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import router from './router'
import axiosConfig from '@/axiosConfig'
import { useAccountStore } from '@/stores/account'
import { useSocketStore } from './stores/socket'
import Loading from '@/components/Loading.vue'
import MediaCall from '@/peer/MediaCall'
import IncommingCall from './components/IncommingCall.vue'
import { useAccountsStore } from './stores/accounts'
import BoxChat from './components/BoxChat.vue'
import { useRoomsStore } from './stores/rooms'

const route = useRoute()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const roomStore = useRoomsStore()
const socketStore = useSocketStore()
const cookies = inject('$cookies')
const mainEl = ref(null)
const headerEl = ref(null)
const showLoading = ref(true)
const showIncommingCall = ref(false)
const isDisplayMiniChat = ref(false)
const miniChatId = ref('')
const incommingData = reactive({
  accountIdFrom: '-',
  accountIdTo: '-',
})

const accessToken = cookies.get('access_token')
const showNavbar = computed(() => route.name != 'login' && route.name != 'error')



if (!accessToken) {
  removeLoadingElement()
  router.push({ name: 'login' })
}

axiosConfig().post('/verify')
  .then(result => {
    const { status } = result.data

    if (status != 'success') {
      router.push({ name: 'login' })
    }

    accountStore.fetchAccount(accessToken)
    socketStore.connectToSocketServer()
    socketStore.resSendMessageActions.push(initDataBeforeRenderMiniChat)
    socketStore.resCallActions.push(onIncommingCall)

    const id = setInterval(() => {
      if (socketStore.socket !== null && accountStore._id !== null) {
        clearInterval(id)

        const account = accountStore.clone()
        accountsStore.addOne(account)
        socketStore.registerClientInfo(accountStore._id)
        const mediaCall = new MediaCall(accountStore._id, _mediaCall => { })
        window.mediaCall = mediaCall

        removeLoadingElement()
        // test()
      }
    }, 100)
  })
  .catch(err => {
    console.log(err)
    router.push({ name: 'login' })
  })




onMounted(() => {
  updateMainContentHeight()

  window.addEventListener('resize', updateMainContentHeight)
})

onBeforeMount(() => {
  // socketStore.resCallActions = socketStore.resCallActions.filter(func => func != onIncommingCall)
})


function updateMainContentHeight() {
  const h = window.innerHeight - headerEl.value.clientHeight
  mainEl.value.style.height = h + 'px'
}

function removeLoadingElement() {
  showLoading.value = false
}

function initDataBeforeRenderMiniChat(message) {
  const roomId = message.roomId

  axiosConfig().get(`/room/${roomId}`)
    .then(result => {
      const room = result.data.room
      roomStore.addOne(room)

      return axiosConfig().post(`/account/list`, {
        accountIdArray: room.members
      })

    })
    .then(result => {
      accountsStore.addMany(result.data.accounts)

      setTimeout(() => {
        miniChatId.value = roomId
        isDisplayMiniChat.value = true
      }, 2000);
    })
    .catch(console.log)
}

function closeMiniChat() {
  console.log('close mini chat')
  document.querySelector('.box-chat')?.classList.add('animation-close')

  setTimeout(() => {
    isDisplayMiniChat.value = false
    miniChatId.value = ''
  }, 500);
}

//#region CALL --- RECIPIENT SIDE
// recipient side
function onIncommingCall({ accountIdFrom, accountIdTo }) {
  // console.log({ accountIdFrom, accountIdTo })
  incommingData.accountIdFrom = accountIdFrom
  incommingData.accountIdTo = accountIdTo
  showIncommingCall.value = true
}

// recipient side
function onAcceptCall() {
  showIncommingCall.value = false
  router.push({
    name: 'call',
    params: { partnerId: incommingData.accountIdFrom },
    query: { recevie: true }
  })
}

// recipient side
function onRejectCall() {
  showIncommingCall.value = false
  socketStore.socket.emit('req-reject-call', {
    accountIdFrom: incommingData.accountIdFrom,
    accountIdTo: incommingData.accountIdTo
  })
}
//#endregion
</script>