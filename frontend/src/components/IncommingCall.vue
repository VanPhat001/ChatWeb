<style scoped>
.animation-appear {
    animation-name: appear;
    animation-duration: 1.4s;
    animation-iteration-count: 1;
}

.animation-close {
    animation-name: close;
    animation-duration: 1.4s;
    animation-iteration-count: 1;
    animation-fill-mode: both;
}

@keyframes appear {
    from {
        top: -100%;
    }
}

@keyframes close {
    to {
        top: -100%;
    }
}
</style>

<template>
    <div ref="incommingCallEl"
        class="incomming-call animation-appear flex border-2 max-w-[452px] w-2/3 items-center py-4 px-6 rounded-md bg-[#2a2b2c]">
        <Avatar :src="'https://cdn.waifu.im/6982.jpg'"></Avatar>
        <p class="flex-1 px-2 text-xl">{{ 'user name' }}</p>

        <button class="p-2 bg-gray-200 opacity-80 hover:opacity-100 rounded-full" @click="onAccept">
            <Icon height="20" icon="subway:call-1" color="blue"></Icon>
        </button>
        <button class="p-2 bg-gray-200 opacity-80 hover:opacity-100 rounded-full ml-2" @click="onReject">
            <Icon height="20" icon="subway:call-3" color="red"></Icon>
        </button>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Avatar from './Avatar.vue'
import { ref } from 'vue'

const incommingCallEl = ref(null)
const emits = defineEmits(['onAccept', 'onReject'])

function onAccept() {
    playAnimationClose()
        .then(() => emits('onAccept'))
        .catch(console.log)
}

function onReject() {
    playAnimationClose()
        .then(() => emits('onReject'))
        .catch(console.log)
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function playAnimationClose() {
    incommingCallEl.value.classList.add('animation-close')
    await delay(1400)
}

</script>