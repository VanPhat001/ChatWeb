<template>
    <div class="friend-search-view py-3">
        <div class="border border-white/10 flex mx-5 bg-gray-500/20 rounded-full">
            <input autofocus type="text" class="bg-transparent outline-none flex-1 px-2.5 py-1.5"
                placeholder="Enter account name..." v-model="searchText">
            <button @click="findAccountByRegex" class="px-3 flex items-center justify-center">
                <Icon icon="material-symbols:search" height="22"></Icon>
            </button>
        </div>

        <div class="my-3">
            <template v-for="(account, index) in accountList" :key="index">
                <FriendCard :account="account" :friend-id="account._id" :submit-text="''" :cancel-text="''"></FriendCard>
            </template>
        </div>
    </div>
</template>


<script setup>
import axiosConfig from '@/axiosConfig';
import FriendCard from '@/components/FriendCard.vue';
import Debounce from '@/helpers/Debounce';
import { useAccountStore } from '@/stores/account';
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';

const accountStore = useAccountStore()

const searchText = ref('')
const accountList = ref([])

const debounce = new Debounce(() => {
    findAccountByRegex()
})

watch(() => searchText.value, () => {
    debounce.reStart()
})


function findAccountByRegex() {
    const text = searchText.value
    if (text === '') {
        return
    }

    axiosConfig().get(`/account/name/regex/${text}`)
        .then(result => {
            accountList.value = result.data.accounts.filter(account => account._id != accountStore._id)

            // for (let i = 0; i < 20; i++)
            // {
            //     accountList.value.push(accountList.value[0])
            // }
        })
        .catch(console.log)
}
</script>