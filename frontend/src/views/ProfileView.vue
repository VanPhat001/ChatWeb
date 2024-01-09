<template>
    <div class="profile-view w-full h-full overflow-y-auto">

        <template v-if="account">
            <div class="bg-transparent pb-2 relative overflow-hidden">
                <img :src="account.background"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[24px] h-full w-[300%]"
                    alt="">


                <div class="w-[80%] m-auto">
                    <div class="group/background relative m-auto rounded-lg overflow-hidden">
                        <img @click="showImageModal(account.background)" :src="account.background"
                            class="block m-auto w-full h-[500px]" alt="">
                        <!-- change background button -->
                        <button v-if="accountId == accountStore._id"
                            class="group-hover/background:visible invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full flex bg-black/70"
                            @click.prevent="changeBackground">
                            <Icon height="56" class="m-auto" icon="fluent:image-arrow-counterclockwise-24-filled">
                            </Icon>
                        </button>
                    </div>

                    <div class="px-8 flex h-[calc(152px*2/3+12px)]">
                        <div class="group/avatar -translate-y-1/3 relative ">
                            <Avatar @click="showImageModal(account.avatar)" class="rounded-full border-4 border-[#3d3a3a]"
                                :src="account.avatar" :size="152">
                            </Avatar>
                            <!-- change avatar button -->
                            <button v-if="accountId == accountStore._id"
                                class="group-hover/avatar:visible invisible absolute top-0 left-0 size-[152px] rounded-full flex bg-black/70"
                                @click.prevent="changeAvatar">
                                <Icon height="40" class="m-auto" icon="fluent:image-arrow-counterclockwise-24-filled">
                                </Icon>
                            </button>
                        </div>


                        <div class="flex flex-col justify-center ml-2">
                            <p class="text-2xl">{{ account.name }}</p>
                            <p class="opacity-70">
                                <span>{{ "0 bạn bè" }}</span> •
                                <span>{{ "0 đang theo dõi" }}</span>
                            </p>
                        </div>


                        <!-- 
                        - Tài khoản cá nhân [personal]
                        - Đã là bạn bè ( huỷ kết bạn, nhắn tin ) [friend]
                        - Không là bạn bè 
                            + Chưa gửi lời mời kết bạn ( thêm bạn bè, nhắn tin ) [none]
                            + Đã gửi lời mời kết bạn ( huỷ lời mời, nhắn tin ) [send]
                            + Nhận được lời mời kết bạn ( đồng ý, nhắn tin ) [receive]
                        -->
                        <div class="ml-auto flex items-center">
                            <template v-if="relationship == 'personal'">
                                <button class="bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md"
                                    @click="isDisplayProfileEdit = true">Chỉnh sửa hồ sơ</button>
                                <!-- <button class="ml-1 bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md">cái nút</button> -->
                            </template>
                            <template v-else-if="relationship == 'friend'">
                                <button class="bg-gray-600 hover:bg-gray-700 text-gray-200 px-6 py-1 rounded-md"
                                    @click="deleteFriendRequest">Huỷ kết
                                    bạn</button>
                                <button class="ml-1 bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md">Nhắn
                                    tin</button>
                            </template>
                            <template v-else-if="relationship == 'none'">
                                <button class="bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md"
                                    @click="sendRequestAddFriend">Thêm bạn bè</button>
                                <button class="ml-1 bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md">Nhắn
                                    tin</button>
                            </template>
                            <template v-else-if="relationship == 'send'">
                                <button class="bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md"
                                    @click="cancelRequestAddFriend">Huỷ lời mời</button>
                                <button class="ml-1 bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md">Nhắn
                                    tin</button>
                            </template>
                            <template v-else-if="relationship == 'receive'">
                                <button class="bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md"
                                    @click="acceptRequestAddFriend">Đồng ý</button>
                                <button class="ml-1 bg-blue-500 hover:bg-blue-600 text-gray-200 px-6 py-1 rounded-md">Nhắn
                                    tin</button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <ImageModal :src="imageModalSource" @on-close="onCloseImageModal" v-show="isDisplayImageModal"></ImageModal>
            <PostList :posts="posts" :allow-scrollbar="false"></PostList>
        </template>

        <Error v-else class="w-full !h-full"></Error>
        <ProfileEdit v-if="isDisplayProfileEdit" @on-close="isDisplayProfileEdit = false" @on-save="onUpdateProfile"
            :account="accountStore.clone()"></ProfileEdit>

    </div>
</template>


<script setup>
import axiosConfig from '@/axiosConfig'
import Avatar from '@/components/Avatar.vue'
import Error from '@/components/Error.vue'
import ImageModal from '@/components/ImageModal.vue'
import PostList from '@/components/PostList.vue'
import ProfileEdit from '@/components/ProfileEdit.vue'
import { uploadFileToCloudinary } from '@/helpers'
import { useAccountStore } from '@/stores/account'
import { useAccountsStore } from '@/stores/accounts'
import { Icon } from '@iconify/vue'
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'


provide('showImageModal', showImageModal)

const route = useRoute()
const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const posts = ref([])
const imageModalSource = ref('')
const isDisplayImageModal = ref(false)
const isDisplayProfileEdit = ref(false)

const accountId = computed(() => route.params.id)
const account = ref(null)
const relationship = ref(null) // enums [ personal, none, friend, send, receive ]

console.log('accountid', accountId.value)

if (accountStore._id === accountId.value) {
    account.value = accountStore.clone()
    relationship.value = 'personal'
} else if (accountsStore.contain(accountId.value)) {
    account.value = accountsStore.get(accountId.value)
}

if (relationship.value === null) {
    fetchRelationship()
        .then(result => {
            relationship.value = result.data.relationship
        })
        .catch(console.log)
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



function fetchRelationship() {
    return axiosConfig().get(`/friend/${accountStore._id}/${accountId.value}/relationship`)
}

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

function changeAvatar() {
    uploadFileToCloudinary(result => {
        const { public_id, url } = result.info

        axiosConfig().patch(`/account/${accountId.value}`, {
            avatar: url
        })
            .then(result => {
                const _account = result.data.account
                accountStore.avatar = _account.avatar
                account.value = _account
            })
            .catch(console.log)
    })
}

function changeBackground() {
    uploadFileToCloudinary(result => {
        const { public_id, url } = result.info

        axiosConfig().patch(`/account/${accountId.value}`, {
            background: url
        })
            .then(result => {
                const _account = result.data.account
                accountStore.background = _account.background
                account.value = _account
            })
            .catch(console.log)
    })
}

function sendRequestAddFriend() {
    axiosConfig().post('/requestAddFriend', {
        accountFrom: accountStore._id,
        accountTo: accountId.value
    }).then(result => {
        relationship.value = 'send'
    }).catch(console.log)
}

function acceptRequestAddFriend() {
    axiosConfig().delete(`/requestAddFriend/${accountId.value}/${accountStore._id}/accept`)
        .then(result => {
            relationship.value = 'friend'
        })
        .catch(console.log)
}

function cancelRequestAddFriend() {
    axiosConfig().delete(`/requestAddFriend/${accountId.value}/${accountStore._id}/cancel`)
        .then(result => {
            relationship.value = 'none'
        })
        .catch(console.log)
}

function onUpdateProfile({ newAccount }) {
    accountStore.update(newAccount)
    accountsStore.accountMap.set(newAccount._id, newAccount)
    account.value = accountStore.clone()
    isDisplayProfileEdit.value = false
}

function deleteFriendRequest(accountIndex) {
    console.log(`${accountStore._id} / ${accountId.value}`)

    axiosConfig().delete(`/friend/${accountStore._id}/${accountId.value}`)
        .then(result => {
            relationship.value = 'none'
        })
        .catch(console.log)
}
</script>