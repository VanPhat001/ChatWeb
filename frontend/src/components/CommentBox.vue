<style scoped>
.input-tag:empty:not(:focus)::before {
    content: attr(data-placeholder);
}
</style>

<template>
    <div class="comment-box" v-if="fetchFinish">
        <p autofocus
            class="input-tag mt-2 py-2 px-3.5 outline-none bg-[#3a3b3c] opacity-80 rounded-xl max-h-[120px] overflow-y-auto"
            ref="inputEl" @keydown.enter.prevent="postComment" @keyup="updateText"
            data-placeholder="Viết bình luận công khai..." contenteditable>
        </p>

        <div class="flex items-start mt-3 px-5" v-for="(cmt, index) in comments" :key="index">
            <Avatar :size="44" :src="getAvatar(cmt.accountId)"></Avatar>
            <div class="flex-1 pl-1.5">
                <div class="bg-[#3a3b3c] rounded-lg px-2 py-1 w-fit">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid placeat, earum porro voluptates eveniet accusamus, labore laborum asperiores corrupti esse officiis dolor voluptate totam! Explicabo nesciunt at obcaecati veniam dignissimos. {{ cmt.text }}</p>
                </div>
                <span class="ml-2 italic text-[84%] opacity-80 hover:text-blue-500 cursor-pointer">Phản hồi</span>
                <span class="italic text-[66%] opacity-80"> • {{ calcTimeActive(cmt.createdAt) }}</span>
            </div>
            
        </div>

        <button class="mt-2 italic opacity-80 text-[90%] hover:underline hover:text-blue-600" ref="showMoreButton" @click="continueFetchComments" v-show="commentRemain > 0">xem thêm {{ commentRemain }}
            bình luận</button>

        <div class="mb-3"></div>

    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig'
import { computed, inject, ref } from 'vue'
import Avatar from './Avatar.vue'
import { getDifferenceBetween2Date } from '@/helpers';
import { useAccountsStore } from '@/stores/accounts';
import { useAccountStore } from '@/stores/account';

const emits = defineEmits(['onCreateNewComment'])
const props = defineProps({
    authorAccount: {
        type: Object,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    post: {
        type: Object,
        required: true
    }
})

const showMoreButton = ref(null)
const authorAccount = computed(() => props.authorAccount)
const postId = computed(() => props.postId)
const post = computed(() => props.post)
const commentRemain = computed(() => post.value.commentCount - comments.value.length)

const accountStore = useAccountStore()
const accountsStore = useAccountsStore()

const fetchFinish = ref(false)
const inputEl = ref(null)
const text = ref('')
const comments = ref([])
const fetchCommentSize = 4

fetchComments({ limit: fetchCommentSize })
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
    if (text.value) {
        createComment(text.value)
        clearInput()
    }
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
            emits('onCreateNewComment')
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

function continueFetchComments() {
    showMoreButton.value.disabled = true

    const data = {
        skip: comments.value.length,
        limit: Math.min(fetchCommentSize, commentRemain.value)
    }

    fetchComments(data)
        .then(async _comments => {
            comments.value = comments.value.concat(_comments) 
            // console.log({accountIdSet})
            return fetchAccounts(_comments)
        })
        .then(accounts => {
            accountsStore.addMany(accounts)
        })
        .catch(console.log)
        .finally(() => {
            showMoreButton.value.disabled = false
        })
}
</script>