<template>
    <div class="post-list h-full w-full flex flex-col-reverse overflow-auto">
        <template v-for="(item, index) in posts" :key="index">
            <Post class="m-auto w-[660px]" :post="item"></Post>
        </template>
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
    }
})

const posts = computed(() => props.posts)

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