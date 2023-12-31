<template>
    <div class="post bg-[#242526] w-[500px] my-3 rounded-lg p-2">
        <!-- post header -->
        <div class="flex items-center">
            <Avatar :src="authorAccount.avatar"></Avatar>
            <div class="ml-2">
                <p>{{ authorAccount.name }}</p>
                <p class="opacity-70 text-[80%]">{{ countTimeActive }}</p>
            </div>

            <button class="controls ml-auto hover:bg-gray-600 rounded-full p-2">
                <Icon icon="ph:x-bold"></Icon>
            </button>
        </div>

        <!-- text box -->
        <div class="p-2">
            <p>{{ post.text }}</p>
        </div>

        <!-- image box -->
        <div class="max-h-[360px] flex justify-center items-center overflow-hidden my-1.5" v-if="post.image">
            <img class="h-full w-full" :src="post.image" alt="image">
        </div>

        <!-- react -->
        <div class="flex px-2 my-1.5">
            <div class="flex items-center">
                <span class="opacity-75">{{ post.likes.length }} lượt thích</span>
            </div>
            <div class="ml-auto flex">
                <div class="flex items-center ml-2">
                    <span class="opacity-75">5 bình luận</span>
                </div>
                <div class="flex items-center ml-2">
                    <span class="opacity-75">5 chia sẻ</span>
                </div>
            </div>
        </div>

        <div class="h-[1px]" style="border-top: 1px solid #3e4042;"></div>

        <div class="flex px-2 mt-2">
            <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75">
                <Icon class="m-auto" height="22" icon="mdi:like-outline"></Icon>
                <!-- <Icon height="22" icon="mdi:like"></Icon> -->
            </button>
            <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75">
                <Icon class="m-auto" height="22" icon="mingcute:comment-line"></Icon>
                <!-- <Icon height="22" icon="mingcute:comment-fill"></Icon> -->
            </button>
            <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75">
                <Icon class="m-auto" height="22" icon="majesticons:share-line"></Icon>
                <!-- <Icon height="22" icon="majesticons:share"></Icon> -->
            </button>

        </div>

        <!-- comment box -->
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Avatar from './Avatar.vue'
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import axiosConfig from '@/axiosConfig'
import { getDifferenceBetween2Date } from '@/helpers'

const clock = inject('clock')

const props = defineProps(['post'])
const post = computed(() => props.post)
const accountsStore = useAccountsStore()
const authorAccount = ref({})
const countTimeActive = ref('')

fetchAccount(post.value.author)
    .then(account => {
        accountsStore.addOne(account)
        authorAccount.value = account
    })
    .catch(console.log)

clock.register(clockTick)

onBeforeUnmount(() => {
    clock.unSubcribe(clockTick)
})



function clockTick() {
    countTimeActive.value = getDifferenceBetween2Date(new Date(), new Date(post.value.createdAt))
    // console.log(countTimeActive.value)
}

async function fetchAccount(accountId) {
    if (accountsStore.contain(accountId)) {
        return accountsStore.get(accountId)
    }

    const result = await axiosConfig().get(`/account/${accountId}`)
    return result.data.account
}

</script>