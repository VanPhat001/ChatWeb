<template>
    <div class="friend-request-view p-3">
        <template v-for="(friendId, index) in accountIds" :key="index">
            <FriendCard :friend-id="friendId" :account="accountsStore.get(friendId)" @on-submit="onAccept(index)" @on-cancel="onCancel(index)"></FriendCard>
        </template>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
import { useAccountStore } from '@/stores/account';
import FriendCard from '../components/FriendCard.vue';
import { ref } from 'vue';
import { useAccountsStore } from '@/stores/accounts';

const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const accountIds = ref([])

axiosConfig().get(`/requestAddFriend/to/${accountStore._id}`)
    .then(async result => {
        const _accountIds = result.data.accountIds

        const _result = await axiosConfig().post('/account/list', {
            accountIdArray: _accountIds
        })

        const accounts = _result.data.accounts
        accountsStore.addMany(accounts)

        accountIds.value = _accountIds
    })
    .catch(console.log)


function onAccept(index) {
    axiosConfig().delete(`/requestAddFriend/${accountIds.value[index]}/${accountStore._id}/accept`)
    .then(result => {
        accountIds.value.splice(index, 1)
    })
    .catch(console.log)
}

function onCancel(index) {

}
</script>