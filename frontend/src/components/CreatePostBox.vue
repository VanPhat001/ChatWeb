<template>
    <div class="create-post-box w-[530px] h-[430px] bg-[#242526] rounded-lg border border-[#2f3031] flex flex-col">
        <div class="relative py-3.5 border-b border-b-[#2f3031]">
            <p class="text-center text-lg font-bold">Tạo bài viết</p>
            <button @click="emits('onClose')"
                class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 bg-[#3a3b3c] text-[#a7abaf] hover:bg-gray-600">
                <Icon height="20" icon="ph:x-bold"></Icon>
            </button>
        </div>

        <div class="p-3 flex-1 flex flex-col">
            <div class="flex items-center">
                <Avatar :size="50" :src="accountStore.avatar"></Avatar>
                <div class="flex flex-col ml-2">
                    <p>{{ accountStore.name }}</p>
                    <Dropdowns :title="'public'" :item-list="['private', 'public']"></Dropdowns>
                </div>
            </div>

            <textarea v-model="text" class="flex-1 my-3 resize-none mb-3 bg-transparent outline-none"
                placeholder="Bạn đang nghĩ gì?"></textarea>
            <button @click="createPost" class="bg-[#505151] w-full py-1.5 rounded-lg text-[#858586]"
                :class="{ 'bg-blue-500 text-white': text.length > 0 }" :disabled="text.length == 0">Đăng</button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Avatar from './Avatar.vue'
import Dropdowns from './Dropdowns.vue'
import { useAccountStore } from '@/stores/account'
import { computed, ref } from 'vue';
import axiosConfig from '@/axiosConfig';

const emits = defineEmits(['onClose'])
const accountStore = useAccountStore()
const text = ref('')

function createPost() {
    axiosConfig().post('/post', {
        author: accountStore._id,
        text: text.value
    })
    .then(console.log)
    .catch(console.log)

    emits('onClose')
}

</script>