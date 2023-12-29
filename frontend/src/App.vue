<template>
  <div class="w-screen h-screen">
    <header ref="headerEl">
      <Navbar v-show="showNavbar"></Navbar>
    </header>
    <main ref="mainEl">
      <RouterView></RouterView>
      <!-- <NuxtWelcome /> -->
    </main>
    <Loading v-if="showNavbar"></Loading>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import router from './router'
import axios from '@/axiosConfig'
import { useAccountStore } from '@/stores/account'
import { useSocketStore } from './stores/socket'
import Loading from '@/components/Loading.vue'

const route = useRoute()
const mainEl = ref(null)
const headerEl = ref(null)
const cookies = inject('$cookies')
const accountStore = useAccountStore()
const socketStore = useSocketStore()

const accessToken = cookies.get('access_token')

if (!accessToken) {
  router.push({ name: 'login' })
}

axios.post('/verify')
  .then(result => {
    const { status } = result.data

    if (status != 'success') {
      router.push({ name: 'login' })
    }

    accountStore.fetchAccount(accessToken)
    socketStore.connectToSocketServer()

    const id = setInterval(() => {
      if (socketStore.socket != null) {
        clearInterval(id)
      }

      socketStore.registerClientInfo(accountStore._id)
      document.getElementsByClassName('loading')[0]?.remove()
    }, 100)
  })
  .catch(err => {
    console.log(err)
    router.push({ name: 'login'})
  })

const showNavbar = computed(() => route.name != 'login' && route.name != 'error')


function updateMainContentHeight() {
  const h = window.innerHeight - headerEl.value.clientHeight
  mainEl.value.style.height = h + 'px'
}

onMounted(() => {
  updateMainContentHeight()

  window.addEventListener('resize', updateMainContentHeight)
})






</script>