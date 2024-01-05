<template>
    <div class="post-view flex flex-col-reverse overflow-y-auto justify-start h-full w-full">
        <div class="m-auto mt-2 bg-[#242526] w-[660px] max-w-[60%] rounded-lg p-2" v-if="authorAccount && post">
            <ImageModal v-if="isShowImageModal" class="z-10" :src="imageModalSource" @on-close="onCloseImageModal"></ImageModal>

            <!-- post header -->
            <div class="flex items-center">
                <Avatar :src="authorAccount.avatar" :account-id="authorAccount._id"></Avatar>
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
                <p ref="textEl" class="">{{ post.text }}</p>
            </div>

            <!-- image box -->
            <div class="max-h-[360px] flex justify-center items-center overflow-hidden my-1.5" v-if="post.image.url">
                <img @click="openImage(post.image.url)" class="h-full w-full" :src="post.image.url" alt="image">
            </div>

            <!-- react -->
            <div class="flex px-2 my-1.5">
                <div class="flex items-center">
                    <span class="opacity-75">{{ post.likes.length }} lượt thích</span>
                </div>
                <div class="ml-auto flex">
                    <div class="flex items-center ml-2">
                        <span class="opacity-75">{{ post.commentCount }} bình luận</span>
                    </div>
                    <div class="flex items-center ml-2">
                        <span class="opacity-75">0 chia sẻ</span>
                    </div>
                </div>
            </div>

            <div class="h-[1px]" style="border-top: 1px solid #3e4042;"></div>

            <div class="flex px-2 my-2">
                <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75" @click="likePost">
                    <Icon v-if="userLikePost" class="m-auto text-blue-500" height="22" icon="mdi:like"></Icon>
                    <Icon v-else class="m-auto" height="22" icon="mdi:like-outline"></Icon>
                </button>
                <!-- <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75" @click="openPostView"> -->
                <!-- <Icon class="m-auto" height="22" icon="mingcute:comment-line"></Icon> -->
                <!-- <Icon height="22" icon="mingcute:comment-fill"></Icon> -->
                <!-- </button> -->
                <button class="flex-1 flex hover:bg-gray-600 rounded-lg py-1.5 opacity-75">
                    <Icon class="m-auto" height="22" icon="majesticons:share-line"></Icon>
                    <!-- <Icon height="22" icon="majesticons:share"></Icon> -->
                </button>
            </div>

            <div class="h-[1px]" style="border-top: 1px solid #3e4042;"></div>

            <CommentBox class="mt-4" @on-create-new-comment="increaseCommentCount" :author-account="authorAccount" :post="post" :post-id="postId"></CommentBox>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import axiosConfig from '@/axiosConfig'
import { getDifferenceBetween2Date } from '@/helpers'
import { useAccountStore } from '@/stores/account'
import { useRoute } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import CommentBox from '@/components/CommentBox.vue'
import ImageModal from '@/components/ImageModal.vue'



const clock = inject('clock')
// const showImageModal = inject('showImageModal')

const postId = computed(() => route.params.id)

const route = useRoute()
const accountsStore = useAccountsStore()
const accountStore = useAccountStore()

const post = ref(null)
const showPostModal = ref(false)
const textEl = ref(null)
const showMoreButtonEl = ref(null)
const authorAccount = ref(null)
const countTimeActive = ref('')
const userLikePost = ref(false)
const imageModalSource = ref('')
const isShowImageModal = ref(false)



fetchPost()
    .then(_post => {
        post.value = _post
        return fetchAccount(_post.author)
    })
    .then(account => {
        accountsStore.addOne(account)
        authorAccount.value = account
        userLikePost.value = isUserLikePost()
    })
    .catch(console.log)

clock.register(clockTick)


onBeforeUnmount(() => {
    clock.unSubcribe(clockTick)
})


function openImage(imgSource) {
    isShowImageModal.value = true
    imageModalSource.value = imgSource
}

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

async function fetchPost() {
    const result = await axiosConfig().get(`/post/${postId.value}`)
    return result.data.post
}

function isUserLikePost() {
    const accountId = accountStore._id
    return post.value.likes.indexOf(accountId) !== -1
}

function likePost() {
    const accountId = accountStore._id
    const accountIndex = post.value.likes.indexOf(accountId)

    console.log(post.value._id, accountId)
    if (accountIndex == -1) {
        // push accountId into post.likes
        post.value.likes.push(accountId)
        userLikePost.value = true

        axiosConfig().patch(`/post/${post.value._id}/account/${accountId}/like`)
            // .then()
            .catch(console.log)
    } else {
        post.value.likes.splice(accountIndex, 1)
        userLikePost.value = false

        axiosConfig().patch(`/post/${post.value._id}/account/${accountId}/unlike`)
            // .then()
            .catch(console.log)
    }
}

function increaseCommentCount() {
    post.value.commentCount++
}

function onCloseImageModal() {
    isShowImageModal.value = false
}
</script>