<template>
    <div class="friend-list w-full h-full overflow-y-auto p-4">

        <router-link :to="{ name: 'profile', params: { id: friendId } }" class="inline-block md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-4" v-for="(friendId, index) in friendIds" :key="index"
            :set="account = accountsStore.get(friendId)">
            <div class="bg-[#242526] p-6 rounded-lg shadow-md">
                <!-- <img :src="'https://cdn.waifu.im/8095.jpg'" alt="Card Image"
                        class="w-full h-52 object-cover mb-4 rounded-md"> -->
                <img :src="account.avatar" alt="Card Image" class="w-full h-52 object-cover mb-4 rounded-md">
                <h2 class="text-xl font-semibold mb-2">{{ account.name }}</h2>
                <!-- <p class="text-gray-600 mb-4">{{ 'card.content' }}</p> -->
                <button @click.prevent="" class="bg-blue-500 w-full text-white py-1.5 rounded-md hover:bg-blue-600">Xác nhận</button>
                <button @click.prevent="" class="bg-[#3a3b3c] w-full text-white py-1.5 mt-1.5 rounded-md hover:bg-[#3a3b3c]/70">Xoá</button>

            </div>
        </router-link>
    </div>
</template>

<script setup>
import axiosConfig from '@/axiosConfig';
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

        for (let i = 0; i < 20; i++) {
            _friendIds.push(_friendIds[0])
        }

        friendIds.value = _friendIds
    })
    .catch(console.log)


async function fetchAccounts(accountIdArray) {
    const result = await axiosConfig().post('/account/list', {
        accountIdArray
    })
    return result.data.accounts
}
</script>