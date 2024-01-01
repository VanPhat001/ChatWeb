<template>
  <div class="home-view h-full w-full">
    <ImageModal class="z-10" @on-close="onCloseModal" v-show="isDisplayImageModal" :src="imageModalSrc"/>

    <PostList :posts="posts"></PostList>

    <button @click="openCreatePostBox"
      class="fixed bottom-6 right-6 rounded-full p-2.5 bg-blue-500 opacity-75 hover:opacity-100">
      <Icon height="24" icon="jam:write"></Icon>
    </button>

    <div class="fixed inset-0" v-show="isDisplayCreatePostBox">
      <div class="absolute bg-black inset-0 opacity-85"></div>
      <CreatePostBox @on-close="closeCreatePostBox" @on-post-created="onPostCreated"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></CreatePostBox>
    </div>
  </div>
</template>

<script setup>
import PostList from '@/components/PostList.vue'
import Modal from '../components/Modal.vue'
import CreatePostBox from '../components/CreatePostBox.vue'
import { Icon } from '@iconify/vue'
import { onMounted, onUpdated, provide, ref } from 'vue'
import axiosConfig from '@/axiosConfig'
import ImageModal from '@/components/ImageModal.vue'


const isDisplayCreatePostBox = ref(false)
const isDisplayImageModal = ref(false)
const imageModalSrc = ref('')
const posts = ref([])

provide('showImageModal', (imageSrc) => {
  openImageModal()
  imageModalSrc.value = imageSrc
})

axiosConfig().get('/post')
  .then(result => {
    const _posts = result.data.posts
    posts.value = _posts

  })
  .catch(console.log)

function openCreatePostBox() {
  isDisplayCreatePostBox.value = true
}

function closeCreatePostBox() {
  isDisplayCreatePostBox.value = false
}

function openImageModal() {
  isDisplayImageModal.value = true
}

function closeImageModal() {
  isDisplayImageModal.value = false
}

function onPostCreated({ post }) {
  posts.value.push(post)
  closeCreatePostBox()
}

function onCloseModal() {
  // console.log('on close modal')
  closeImageModal()
}
</script>