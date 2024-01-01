<template>
    <div class="image-modal fixed inset-0">
        <div @click="emits('onClose')" class="bg-black w-full h-full opacity-80"></div>
        <button @click="emits('onClose')" class="absolute top-8 left-8 -translate-x-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-700 rounded-full">
            <Icon class="text-white" height="26" icon="ic:round-close"></Icon>
        </button>
        <img class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[82%] max-h-[82%]" :src="src" alt="">
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const emits = defineEmits(['onClose'])
const props = defineProps({
    src: {
        type: String,
        default: ''
    }
})

const src = computed(() => props.src)

</script>