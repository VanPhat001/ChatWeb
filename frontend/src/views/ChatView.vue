<template>
    <div class="chat-page flex w-full h-full">
        <!-- friend chat list -->
        <div class="sidebar w-[320px] border border-[--border] h-full flex flex-col">
            <!-- search box -->
            <div class="px-2 py-3">
                <div class="flex bg-[#3a3b3c] rounded-xl px-2 py-1">
                    <button>
                        <Icon name="ic:round-search" size="24"></Icon>
                    </button>
                    <input type="text" class="flex-1 bg-transparent outline-none px-1" placeholder="Tìm kiếm">
                </div>
            </div>
            <!-- friends -->
            <div class="flex-1 h-full overflow-y-auto px-2">
                <div class="friend p-2 rounded-lg flex hover:bg-gray-600" v-for="(item, index) in 14" :key="index">
                    <img src="https://cdn.waifu.im/7620.jpg" alt="avatar" class="w-[56px] h-[56px] rounded-full">
                    <div class="flex-1 pl-2 flex flex-col justify-center">
                        <p>user name</p>
                        <div class="text-[80%] flex">
                            <p class="line-clamp-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita soluta illo architecto id facere obcaecati ratione, blanditiis ipsa nesciunt repudiandae vel voluptatum, placeat earum alias et in consequatur quibusdam iste!</p>
                            <p class="ml-auto whitespace-nowrap opacity-60">3 giờ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- box chat -->
        <BoxChat class="flex-1 border border-[--border]" @on-info="toggleInfoBox"></BoxChat>

        <!-- user info -->
        <div ref="infoEl" class="sidebar w-[260px] border border-[--border] transition-all overflow-hidden">right</div>
    </div>
</template>

<style scoped>
.close {
    width: 0 !important;
}
</style>

<script setup>
import BoxChat from '@/components/BoxChat.vue'
import { onMounted, ref } from 'vue'

const infoEl = ref(null)

function toggleInfoBox() {
    console.log('clcik')
    if (infoEl.value.classList.contains('close')) {
        infoEl.value.classList.remove('close')
    } else {
        infoEl.value.classList.add('close')
    }
}

onMounted(() => {
    toggleInfoBox()
})
</script>