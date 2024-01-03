<template>
    <div class="profile-view w-full h-full overflow-y-auto">

        <template v-if="account">
        <div class="bg-transparent pb-2 relative overflow-hidden">
                <img :src="account.background"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[100px] h-full w-[300%]"
                    alt="">
                <div class="w-[80%] m-auto">
                    <img :src="account.background" class="block m-auto rounded-lg w-full h-[500px]" alt="">

                    <div class="px-8 flex h-[calc(140px*2/3+2px)]">
                        <Avatar class="rounded-full border-4 border-[#3d3a3a] -translate-y-1/3" :src="account.avatar"
                            :size="140"></Avatar>

                        <div class="flex flex-col justify-center ml-2">
                            <p class="text-2xl">{{ account.name }}</p>
                            <p class="opacity-70">
                                <span>{{ "3 bạn bè" }}</span> •
                                <span>{{ "5 đang theo dõi" }}</span>
                            </p>
                        </div>

                        <div class="ml-auto flex items-center">
                            <button class="bg-blue-500 text-gray-200 px-6 py-1 rounded-md">cái nút</button>
                            <button class="ml-1 bg-blue-500 text-gray-200 px-6 py-1 rounded-md">cái nút</button>
                        </div>
                    </div>
                </div>
            </div>

            <ImageModal :src="imageModalSource" @on-close="onCloseImageModal" v-show="isDisplayImageModal"></ImageModal>
            <PostList :posts="posts" :allow-scrollbar="false"></PostList>
        </template>
            
        <Error v-else class="w-full !h-full"></Error>

    </div>
</template>


<script setup>
import axiosConfig from '@/axiosConfig'
import Avatar from '@/components/Avatar.vue'
import Error from '@/components/Error.vue'
import ImageModal from '@/components/ImageModal.vue'
import PostList from '@/components/PostList.vue'
import { useAccountStore } from '@/stores/account'
import { useAccountsStore } from '@/stores/accounts'
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'


provide('showImageModal', showImageModal)

const route = useRoute()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const posts = ref([])
const imageModalSource = ref('')
const isDisplayImageModal = ref(false)

const accountId = computed(() => route.params.id)
const account = ref(null)

console.log('accountid', accountId.value)

if (accountStore._id === accountId.value) {
    account.value = accountStore.clone()
} else if (accountsStore.contain(accountId.value)) {
    account.value = accountsStore.get(accountId.value)
}

if (account.value === null) {
    fetchAccount()
        .then(result => {
            account.value = result.data.account
        })
        .catch(console.log)
}

fetchPosts()
    .then(result => {
        // console.log(result.data.posts)
        posts.value = result.data.posts
    })
    .catch(console.log)

function fetchAccount() {
    return axiosConfig().get(`/account/${accountId.value}`)
}

function fetchPosts() {
    return axiosConfig().get(`/post/author/${accountId.value}`)
}

function showImageModal(imgSrc) {
    imageModalSource.value = imgSrc
    isDisplayImageModal.value = true
}

function onCloseImageModal() {
    isDisplayImageModal.value = false
}
</script>