import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountsStore = defineStore('accounts', () => {
    const accountMap = ref(new Map())

    function addOne(account) {
        console.log(account._id)
        if (!accountMap.value.has(account._id)) {
            accountMap.value.set(account._id, account)
        }
    }

    function addMany(accountArray) {
        accountArray.forEach(account => {
            addOne(account)
        })
    }

    function get(accountId) {
        return accountMap.value.get(accountId)
    }

    function contain(accountId) {
        return accountMap.value.has(accountId)
    } 

    function setAccountOnline(accountId) {
        const account = get(accountId)
        if (!account) {
            return
        }

        account.lastActive = null
        accountMap.value.set(accountId, account)
    }

    function setAccountOffline(accountId) {
        const account = get(accountId)
        if (!account) {
            return
        }

        account.lastActive = new Date().toLocaleString()
        accountMap.value.set(accountId, account)
    }

    return {
        accountMap, 
        addOne, addMany, get, contain, setAccountOnline, setAccountOffline
    }
})