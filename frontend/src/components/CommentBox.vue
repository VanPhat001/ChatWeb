<style scoped>
.input-tag:empty:not(:focus)::before {
    content: attr(data-placeholder);
}
</style>

<template>
    <div class="comment-box" v-if="fetchFinish">
        <p autofocus class="input-tag mt-2 py-2 px-3.5 outline-none bg-[#3a3b3c] opacity-80 rounded-xl max-h-[120px] overflow-y-auto"
            ref="inputEl" @keydown.enter.prevent="postComment" @keyup="updateText"
            data-placeholder="Viết bình luận công khai..." contenteditable>
        </p>

        <div class="flex items-start mt-3 px-5" v-for="(cmt, index) in comments" :key="index">
            <Avatar :size="44" :src="getAvatar(cmt.accountId)"></Avatar>
            <div class="flex-1 bg-[#3a3b3c] rounded-lg ml-1.5 px-2 py-1">
                <p>{{ cmt.text }}</p>
                • <span class="text-[84%] opacity-80 hover:text-blue-500 cursor-pointer">Phản hồi</span>
                • <span class="text-[84%] opacity-80">{{ calcTimeActive(cmt.createdAt) }}</span>
                •
            </div>
        </div>

        <div class="mb-3"></div>

    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig'
import { computed, inject, ref } from 'vue'
import Avatar from './Avatar.vue'
import { getDifferenceBetween2Date } from '@/helpers';
import { useAccountsStore } from '@/stores/accounts';
import { FlagIcon } from '@heroicons/vue/20/solid';
import { useAccountStore } from '@/stores/account';


const props = defineProps({
    authorAccount: {
        type: Object,
        required: true
    },
    postId: {
        type: String,
        required: true
    }
})

const authorAccount = computed(() => props.authorAccount)
const postId = computed(() => props.postId)

const accountStore = useAccountStore()
const accountsStore = useAccountsStore()

const fetchFinish = ref(false)
const inputEl = ref(null)
const text = ref('')
const comments = ref([])

fetchComments({ limit: 40 })
    .then(_comments => {
        comments.value = _comments
        return fetchAccounts(_comments)
    })
    .then(_accounts => {
        accountsStore.addMany(_accounts)
        fetchFinish.value = true
    })
    .catch(console.log)

function updateText() {
    text.value = inputEl.value.textContent
}

function postComment() {
    createComment(text.value)
    clearInput()
}

function clearInput() {
    inputEl.value.textContent = ''
    text.value = ''
}


function createComment(text) {
    axiosConfig().post('/comment', {
        accountId: accountStore._id,
        postId: postId.value,
        text: text,
        image: null,
        commentReplyId: null
    })
        .then(result => {
            const { comment } = result.data
            comments.value = [comment, ...comments.value]
        })
        .catch(console.log)
}

async function fetchComments(data = { limit: 5, skip: 0 }) {
    const result = await axiosConfig().get(`/comment/all/post/${postId.value}?limit=${data.limit}&skip=${data.skip}`)
    return result.data.comments
}

async function fetchAccounts(commentArray) {
    const accountIdSet = new Set(commentArray.map(cmt => cmt.accountId))
    const result = await axiosConfig().post('/account/list', {
        accountIdArray: [...accountIdSet]
    })
    return result.data.accounts
}

function calcTimeActive(dateTimeString) {
    return getDifferenceBetween2Date(new Date(), new Date(dateTimeString))
}

function getAvatar(accountId) {
    return accountsStore.get(accountId)?.avatar
}
</script>