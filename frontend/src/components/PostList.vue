<template>
    <div class="post-list flex flex-col-reverse" :class="{ 'overflow-y-auto h-full w-full': allowScrollbar }">
        <div class="flex-1"></div>
        <Post class="mx-auto w-[660px]" v-for="(item, index) in posts" :key="index" :post="item"></Post>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
import Post from './Post.vue'
import { computed, onMounted, onUpdated, ref } from 'vue';

const props = defineProps({
    posts: {
        type: Array,
        default: []
    },
    allowScrollbar: {
        type: Boolean,
        default: true
    }
})

const posts = computed(() => props.posts)
const allowScrollbar = computed(() => props.allowScrollbar)

onMounted(() => {
    scrollToTop()
})

onUpdated(() => {
    scrollToTop()
})

function scrollToTop() {
    const items = document.getElementsByClassName('post')
    items[items.length - 1]
        ?.scrollIntoView({ behavior: 'smooth' })
}
</script>