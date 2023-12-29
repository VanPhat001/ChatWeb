<template>
  <div class="w-screen h-screen">
    <header ref="headerEl">
      <Navbar v-show="showNavbar"></Navbar>
    </header>
    <main ref="mainEl">
      <RouterView></RouterView>
      <!-- <NuxtWelcome /> -->
    </main>
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
  })
  .catch(err => {
    console.log(err)
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