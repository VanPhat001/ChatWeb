<template>
    <div class="account-list px-1 overflow-y-auto">
        <button class="w-full flex items-center rounded-lg p-2 hover:bg-gray-600"
            v-for="(accountId, index) in accountIdList" :key="index" @click="emits('onSelectAccountId', { accountId })">
            <Avatar :active="false" :size="44" :src="getAvatar(accountId)" :account-id="accountId"></Avatar>
            <p class="ml-2 text-xl">{{ getName(accountId) }}</p>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Avatar from './Avatar.vue'
import { useAccountsStore } from '@/stores/accounts';

const emits = defineEmits(['onSelectAccountId'])
const props = defineProps({
    accountIdList: {
        type: Array,
        default: []
    }
})

const accountStore = useAccountsStore()
const accountIdList = computed(() => props.accountIdList)

function getAvatar(accountId) {
    return accountStore.get(accountId)?.avatar || ''
}

function getName(accountId) {
    return accountStore.get(accountId)?.name || 'not found'
}

</script>