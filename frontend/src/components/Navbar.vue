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

            <router-link :to="{ name: 'login' }" title="log out" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
                <Icon icon="oi:account-logout" height="28"></Icon>
            </router-link>
        </div>
        <div class="w-[280px] flex justify-end items-center px-3">
            <p class="mr-2 text-[18px]">{{ accountStore.name }}</p>
            <img :src="accountStore.avatar" class="w-[40px] h-[40px] rounded-full inline-block">
        </div>

    </div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';
import { Icon } from '@iconify/vue'
const accountStore = useAccountStore()
</script>