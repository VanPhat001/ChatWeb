import { defineStore } from "pinia"
import axiosConfig from "@/axiosConfig"
import { ref } from "vue"


export const useAccountStore = defineStore('account', () => {
    const _id = ref('')
    const username = ref('')
    const name = ref('')
    const gender = ref('')
    const avatar = ref('')
    const background = ref('')
    const dateOfBirth = ref('')
    const roomContainerId = ref('')
    const postContainerId = ref('')
    const friendContainerId = ref('')
    const requestAddFriendContainerId = ref('')
    // const createdAt = ref('')
    // const updatedAt = ref('')

    async function fetchAccount(accessToken) {
        try {
            const result = await axiosConfig().get('/account', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { account } = result.data

            _id.value = account._id
            username.value = account.username
            name.value = account.name
            gender.value = account.gender
            avatar.value = account.avatar
            background.value = account.background
            dateOfBirth.value = account.dateOfBirth
            roomContainerId.value = account.roomContainerId
            postContainerId.value = account.postContainerId
            friendContainerId.value = account.friendContainerId
            requestAddFriendContainerId.value = account.requestAddFriendContainerId

        } catch (error) {
            console.log(error)
        }
    }

    return {
        _id, username, name, gender, avatar, background, dateOfBirth, roomContainerId,
        postContainerId, friendContainerId, requestAddFriendContainerId,
        fetchAccount
    }
})