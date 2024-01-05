<style scoped>
.active {
    background-color: rgb(255 255 255 / 0.1);
}

.active > .icon {
    background-color: rgb(26 119 242);
}
</style>

<template>
    <div class="friends-view flex w-full h-full">
        <!-- sidebar -->
        <div class="bg-[#242526] w-[230px] max-w-[40%] h-full">
            <div v-for="(item, index) in links" :key="index">
                <router-link :to="{ name: item.name }" class="flex items-center rounded-lg hover:bg-white/10 m-2 p-1.5" :class="{ 'active': item?.active }">
                    <Icon class="icon p-1.5 rounded-full bg-gray-600/60" :icon="item.icon" height="36"></Icon>
                    <span class="ml-1"> {{ item.text }} </span> 
                </router-link> 
            </div>
        </div>

        <main class="flex-1">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';


const links = [
    {
        text: 'Trang chủ',
        icon: 'ion:people',
        name: 'friends',
        active: true
    },
    {
        text: 'Lời mời kết bạn',
        icon: 'ion:person-add',
        name: 'home'
    },
    {
        text: 'Gợi ý',
        icon: 'mdi:person-arrow-right',
        name: 'home'
    },
    {
        text: 'Tất cả bạn bè',
        icon: 'fluent:text-bullet-list-square-person-32-filled',
        name: 'friend-list'
    }
]


</script>