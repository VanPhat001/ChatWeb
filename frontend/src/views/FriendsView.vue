<style scoped>
.active {
  background-color: rgb(255 255 255 / 0.1);
}

.active>.icon {
  background-color: rgb(26 119 242);
}
</style>

<template>
  <div class="friends-view flex w-full h-full">
    <!-- sidebar -->
    <div class="bg-[#242526] w-[230px] max-w-[40%] h-full">
      <div v-for="(item, index) in links" :key="index">
        <router-link :to="{ name: item.name }" class="flex items-center rounded-lg hover:bg-white/10 m-2 p-1.5"
          :class="{ 'active': routeName == item.name }">
          <Icon class="icon p-1.5 rounded-full bg-gray-600/60" :icon="item.icon" height="36"></Icon>
          <span class="ml-1"> {{ item.text }} </span>
        </router-link>
      </div>
    </div>

    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>

      <template v-if="routeName == links[0].name">
        <div class="mt-4">
          <p class="px-7 font-semibold text-xl text-white/80">Lời mời kết bạn</p>
          <FriendRequestView></FriendRequestView>
        </div>
        <hr class="border-gray-500/40 mb-6">
        <div>
          <p class="px-7 font-semibold text-xl text-white/80">Những người bạn có thể biết</p>
          <FriendSuggestView></FriendSuggestView>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import FriendRequestView from './FriendRequestView.vue';
import FriendSuggestView from './FriendSuggestView.vue';


const route = useRoute()
const routeName = computed(() => route.name)

const links = [
  {
    text: 'Trang chủ',
    icon: 'ion:people',
    name: 'friends',
  },
  {
    text: 'Tìm kiếm',
    icon: 'mdi:user-search',
    name: 'friend-search'
  },
  {
    text: 'Lời mời kết bạn',
    icon: 'ion:person-add',
    name: 'friend-request'
  },
  {
    text: 'Gợi ý',
    icon: 'mdi:person-arrow-right',
    name: 'friend-suggest'
  },
  {
    text: 'Tất cả bạn bè',
    icon: 'fluent:text-bullet-list-square-person-32-filled',
    name: 'friend-list'
  },
]


</script>