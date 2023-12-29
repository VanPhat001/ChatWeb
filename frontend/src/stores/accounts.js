import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountsStore = defineStore('accounts', () => {
    const accountsMap = ref(new Map())

    function addOne(account) {
        if (!accountsMap.value.has(account._id)) {
            accountsMap.value.set(account._id, account)
        }
    }

    function addMany(accountArray) {
        accountArray.forEach(account => {
            addOne(account)
        })
    }

    function get(accountId) {
        return accountsMap.value.get(accountId)
    }

    function contain(accountId) {
        return accountsMap.value.has(accountId)
    } 

    return {
        accountsMap, 
        addOne, addMany, get, contain
    }
})