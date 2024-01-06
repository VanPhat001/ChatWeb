<template>
  <router-link class="friend-card inline-block md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4"
    :to="{ name: 'profile', params: { id: friendId } }">

    <div class="bg-[#242526] p-6 rounded-lg shadow-md">
      <img :src="account.avatar" alt="Card Image" class="w-full h-52 object-cover mb-4 rounded-md">

      <h2 class="text-xl font-semibold mb-2">{{ account.name }}</h2>
      <!-- <p class="text-gray-600 mb-4">{{ 'card.content' }}</p> -->

      <button @click.prevent="emits('onSubmit')" class="bg-blue-500 w-full text-white py-1.5 rounded-md hover:bg-blue-600">{{
        submitText }}</button>

      <button @click.prevent="emits('onCancel')" class="bg-[#3a3b3c] w-full text-white py-1.5 mt-1.5 rounded-md hover:bg-[#3a3b3c]/70">{{
        cancelText
      }}</button>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const emits = defineEmits(['onSubmit', 'onCancel'])

const props = defineProps({
  friendId: {
    type: String,
    required: true
  },
  account: {
    type: Object,
    required: true
  },
  submitText: {
    type: String,
    default: 'Xác nhận',
  },
  cancelText: {
    type: String,
    default: 'Huỷ'
  }
})

const friendId = computed(() => props.friendId)
const account = computed(() => props.account)
const submitText = computed(() => props.submitText)
const cancelText = computed(() => props.cancelText)
</script>