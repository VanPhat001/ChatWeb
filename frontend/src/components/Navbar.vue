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
        <router-link :to="{ name: 'profile', params: { id: accountId } }" class="w-[280px] flex justify-end items-center px-3">
            <p class="mr-2 text-[18px]">{{ accountStore.name }}</p>
            <Avatar :size="40" :src="accountStore.avatar" :active="true" :bottom-percent="-4" :right-percent="-4"></Avatar>
        </router-link>

    </div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'
import { Icon } from '@iconify/vue'
import { computed, inject } from 'vue'
import Avatar from './Avatar.vue'

const accountStore = useAccountStore()
const cookies = inject('$cookies')

const accountId = computed(() => accountStore._id)


function onLogout() {
    cookies.remove('access_token')
    window.location.href = '/login'
}
</script>