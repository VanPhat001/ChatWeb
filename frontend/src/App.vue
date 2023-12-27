<template>
  <div class="w-screen h-screen">
    <header ref="headerEl">
      <Navbar v-show="route.path != '/login'"></Navbar>
    </header>
    <main ref="mainEl">
      <RouterView></RouterView>
      <!-- <NuxtWelcome /> -->
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const mainEl = ref(null)
const headerEl = ref(null)

function updateMainContentHeight() {
  const h = window.innerHeight - headerEl.value.clientHeight
  mainEl.value.style.height = h + 'px'
  // console.log(h)
}

onMounted(() => {
  updateMainContentHeight()

  window.addEventListener('resize', updateMainContentHeight)
})
</script>