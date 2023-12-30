<template>
    <div class="navbar flex items-center py-2">
        <div class="w-[280px]"></div>
        <div class="flex mx-auto">
            <router-link :to="{ name: 'home' }" title="home" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="dashicons:admin-home" height="28"></Icon>
            </router-link>

            <router-link :to="{ name: 'chat' }" title="chat" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="dashicons:format-chat" height="28"></Icon>
            </router-link>

            <router-link :to="{ name: 'home' }" title="friends" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="pepicons-pop:people" height="28"></Icon>
            </router-link>

            <!-- <router-link :to="{ name: 'login' }" title="log out" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="oi:account-logout" height="28"></Icon>
            </router-link> -->

            <button @click="onLogout" title="log out" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="oi:account-logout" height="28"></Icon>
            </button>

            
        </div>
        <div class="w-[280px] flex justify-end items-center px-3">
            <p class="mr-2 text-[18px]">{{ accountStore.name }}</p>
            <img :src="accountStore.avatar" class="w-[40px] h-[40px] rounded-full inline-block">
        </div>

    </div>
</template>

<script setup>
import router from '@/router';
import { useAccountStore } from '@/stores/account';
import { Icon } from '@iconify/vue'
import { inject } from 'vue';
const accountStore = useAccountStore()
const cookies = inject('$cookies')


function onLogout() {
    cookies.remove('access_token')
    window.location.href = '/login'
}
</script>