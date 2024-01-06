<template>
    <div class="friend-suggest-view p-4">
        <template v-for="(accountId, index) in suggestAccountIds" :key="index">
            <FriendCard :friend-id="accountId" :account="accountsStore.get(accountId)" :submit-text="'Gửi lời mời'"
                :cancel-text="'Xoá'" @on-submit="sendRequestAddFriend(accountId, index)" @on-cancel="onCancel(index)"></FriendCard>
        </template>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
import FriendCard from '@/components/FriendCard.vue';
import { useAccountStore } from '@/stores/account';
import { useAccountsStore } from '@/stores/accounts';
import { SunIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';


const accountStore = useAccountStore()
const accountsStore = useAccountsStore()

const suggestAccountIds = ref([])

axiosConfig().get(`/friend/account/${accountStore._id}/suggest`)
    .then(async result => {
        const { suggests } = result.data
        const accounts = await fetchAccounts(suggests)

        accountsStore.addMany(accounts)
        suggestAccountIds.value = suggests
    })
    .catch(console.log)

async function fetchAccounts(accountIdArray) {
    const result = await axiosConfig().post('/account/list', {
        accountIdArray
    })
    return result.data.accounts
}

function sendRequestAddFriend(accountId, index) {
    axiosConfig().post('/requestAddFriend', {
        accountFrom: accountStore._id,
        accountTo: accountId
    })
        .then(result => {
            suggestAccountIds.value.splice(index, 1)
            console.log(result)
        })
        .catch(console.log)
}

function onCancel(index) {
    suggestAccountIds.value.splice(index, 1)
    // axiosConfig().delete(`/requestAddFriend/${}`)
}
</script>