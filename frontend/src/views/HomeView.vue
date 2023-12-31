<template>
  <div class="home h-full w-full">
    <PostList></PostList>

    <button @click="openCreatePostBox"
      class="fixed bottom-6 right-6 rounded-full p-2.5 bg-blue-500 opacity-75 hover:opacity-100">
      <Icon height="24" icon="jam:write"></Icon>
    </button>

    <div class="fixed inset-0" v-show="showCreatePostBox">
      <div class="absolute bg-black inset-0 opacity-85"></div>
      <CreatePostBox @on-close="closeCreatePostBox" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></CreatePostBox>
    </div>
  </div>
</template>

<script setup>
import PostList from '@/components/PostList.vue'
import Modal from '../components/Modal.vue'
import CreatePostBox from '../components/CreatePostBox.vue'
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const showCreatePostBox = ref(false)

function openCreatePostBox() {
  showCreatePostBox.value = true
}

function closeCreatePostBox() {
  showCreatePostBox.value = false
}

</script>