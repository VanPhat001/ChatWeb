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
import { playIncommingCall } from './sounds'
import IncommingCall from './components/IncommingCall.vue'
import { useAccountsStore } from './stores/accounts'

const route = useRoute()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const socketStore = useSocketStore()
const cookies = inject('$cookies')
const mainEl = ref(null)
const headerEl = ref(null)
const showLoading = ref(true)
const showIncommingCall = ref(false)
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