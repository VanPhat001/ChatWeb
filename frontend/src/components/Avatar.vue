<template>
    <div class="avatar relative" :style="{ 'width': size + 'px', 'height': size + 'px' }">
        <img :src="src" alt="avatar" class="w-full h-full rounded-full">
        <div class="w-4 h-4 border-[2px] border-[--background] bg-green-600 rounded-full absolute"
            :style="{ 'bottom': bottomPercent + '%', 'right': rightPercent + '%' }" v-show="active"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// https://cdn.waifu.im/195.jpeg

const props = defineProps({
    src: {
        type: String,
        default: 'https://cdn.waifu.im/195.jpeg'
    },
    active: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 40
    },
    rightPercent: {
        type: Number,
        default: 3
    },
    bottomPercent: {
        type: Number,
        default: 3
    }
})

const src = computed(() => props.src)
const active = computed(() => props.active)
const size = computed(() => props.size)
const rightPercent = computed(() => props.rightPercent)
const bottomPercent = computed(() => props.bottomPercent)
</script>