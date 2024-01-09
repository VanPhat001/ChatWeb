<template>
    <div class="friend-list w-full h-full overflow-y-auto p-4">

        <template v-for="(friendId, index) in friendIds" :key="index">
            <FriendCard :friend-id="friendId" :account="accountsStore.get(friendId)" :cancel-text="'Xoá kết bạn'" :submit-text="''" @on-cancel="deleteFriendRequest(index)"></FriendCard>
        </template>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
import FriendCard from '@/components/FriendCard.vue';
import { useAccountStore } from '@/stores/account';
import { useAccountsStore } from '@/stores/accounts';
import { ref } from 'vue';


const accountStore = useAccountStore()
const accountsStore = useAccountsStore()
const friendIds = ref([])

axiosConfig().get(`/friend/account/${accountStore._id}`)
    .then(async result => {
        const _friendIds = result.data.friendIds

        const accounts = await fetchAccounts(_friendIds)
        accountsStore.addMany(accounts)

        // for (let i = 0; i < 20; i++) {
        //     _friendIds.push(_friendIds[0])
        // }

        friendIds.value = _friendIds
    })
    .catch(console.log)


async function fetchAccounts(accountIdArray) {
    const result = await axiosConfig().post('/account/list', {
        accountIdArray
    })
    return result.data.accounts
}

function deleteFriendRequest(accountIndex) {
    const accountId = friendIds.value[accountIndex]
    // console.log({
    //     accountId1: accountStore._id,
    //     accountId2: accountId
    // })
    console.log(`${accountStore._id} / ${accountId}`)

    axiosConfig().delete(`/friend/${accountStore._id}/${accountId}`)
    .then(result => {
        friendIds.value.splice(accountIndex, 1)
    })
    .catch(console.log)
}
</script>