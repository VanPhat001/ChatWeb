<template>
    <div class="post-list h-full w-full flex flex-col overflow-auto">
        <template v-for="(item, index) in posts" :key="index">
            <Post class="m-auto w-[660px]" :post="item"></Post>
        </template>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
import Post from './Post.vue'
import { ref } from 'vue';

const posts = ref([])

axiosConfig().get('/post')
.then(result => {
    const _posts = result.data.posts
    posts.value = _posts
    
})
.catch(console.log)
</script>