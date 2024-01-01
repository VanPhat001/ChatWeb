<template>
    <div class="create-post-box w-[600px] bg-[#242526] rounded-lg border border-[#2f3031] flex flex-col">
        <div class="relative py-3.5 border-b border-b-[#2f3031]">
            <p class="text-center text-lg font-bold">Tạo bài viết</p>
            <button @click="emits('onClose')"
                class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 bg-[#3a3b3c] text-[#a7abaf] hover:bg-gray-600">
                <Icon height="20" icon="ph:x-bold"></Icon>
            </button>
        </div>

        <div class="p-3 flex-1 flex flex-col h-[500px]">
            <div class="flex items-center">
                <Avatar :size="50" :src="accountStore.avatar"></Avatar>
                <div class="flex flex-col ml-2">
                    <p>{{ accountStore.name }}</p>
                    <Dropdowns :title="'public'" :item-list="['private', 'public']"></Dropdowns>
                </div>
            </div>

            <div class="flex-1 my-2 max-h-[300px] min-h-[140px] overflow-y-auto">
                <p ref="inputEl" @keyup="updateText" data-placeholder="Bạn đang nghĩ gì?"
                    class="input-tag py-1.5 outline-none" contenteditable>
                </p>
                <img :src="imageUrl" alt="" class="w-full">
            </div>

            <div class="flex items-center my-3 border border-gray-600 rounded-md p-2">
                <p>Thêm vào bài viết của bạn:</p>
                <button class="p-1.5 ml-1.5 hover:bg-gray-500 rounded-full" @click="uploadFile">
                    <Icon color="lightblue" height="24" icon="ion:image"></Icon>
                </button>
                <button class="p-1.5 ml-1.5 hover:bg-gray-500 rounded-full" @click="removeImage">
                    <Icon color="lightblue" height="24" icon="gridicons:image-remove"></Icon>
                </button>
                <button class="p-1.5 ml-1.5 hover:bg-gray-500 rounded-full" @click="resetData">
                    <Icon color="lightblue" height="24" icon="system-uicons:reset-hard"></Icon>
                </button>

            </div>

            <button @click="createPost" class="bg-[#505151] w-full py-1.5 rounded-lg text-[#858586]"
                :class="{ 'bg-blue-500 text-white': text.length > 0 }" :disabled="text.length == 0">Đăng</button>
        </div>
    </div>
</template>

<style scoped>
.input-tag:empty:not(:focus)::before {
    content: attr(data-placeholder);
}
</style>

<script setup>
import { Icon } from '@iconify/vue'
import Avatar from './Avatar.vue'
import Dropdowns from './Dropdowns.vue'
import { useAccountStore } from '@/stores/account'
import { Teleport, computed, ref } from 'vue';
import axiosConfig from '@/axiosConfig';
import { uploadFileToCloudinary } from '@/helpers/index'

const emits = defineEmits(['onClose', 'onPostCreated'])

const accountStore = useAccountStore()
const text = ref('')
const publicId = ref('')
const imageUrl = ref('')
const inputEl = ref(null)

function createPost() {
    const image = imageUrl.value
        ? { publicId: publicId.value, url: imageUrl.value }
        : null

    axiosConfig().post('/post', {
        author: accountStore._id,
        text: text.value,
        image
    })
        .then(result => {
            const { post } = result.data
            emits('onPostCreated', { post })
        })
        .catch(console.log)
}

function uploadFile() {
    uploadFileToCloudinary(result => {
        const { public_id, url } = result.info
        imageUrl.value = url
        publicId.value = public_id
    })
}

function removeImage() {
    imageUrl.value = ''
}

function resetData() {
    imageUrl.value = ''
    text.value = ''
}

function updateText() {
    text.value = inputEl.value.textContent
}
</script>