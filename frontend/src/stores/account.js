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

    function update(account) {
        const keys = Object.keys(account)

        if (keys.includes('_id')) {
            _id.value = account._id
        }
        if (keys.includes('username')) {
            username.value = account.username
        }
        if (keys.includes('name')) {
            name.value = account.name
        }
        if (keys.includes('gender')) {
            gender.value = account.gender
        }
        if (keys.includes('avatar')) {
            avatar.value = account.avatar
        }
        if (keys.includes('background')) {
            background.value = account.background
        }
        if (keys.includes('dateOfBirth')) {
            dateOfBirth.value = account.dateOfBirth
        }
        if (keys.includes('roomContainerId')) {
            roomContainerId.value = account.roomContainerId
        }
        if (keys.includes('postContainerId')) {
            postContainerId.value = account.postContainerId
        }
        if (keys.includes('friendContainerId')) {
            friendContainerId.value = account.friendContainerId
        }
        if (keys.includes('requestAddFriendContainerId')) {
            requestAddFriendContainerId.value = account.requestAddFriendContainerId
        }
    }

    function clone() {
        return {
            _id: _id.value,
            username: username.value,
            name: name.value,
            gender: gender.value,
            avatar: avatar.value,
            background: background.value,
            dateOfBirth: dateOfBirth.value,
            roomContainerId: roomContainerId.value,
            postContainerId: postContainerId.value,
            friendContainerId: friendContainerId.value,
            requestAddFriendContainerId: requestAddFriendContainerId.value
        }
    }

    return {
        _id, username, name, gender, avatar, background, dateOfBirth, roomContainerId,
        postContainerId, friendContainerId, requestAddFriendContainerId,
        fetchAccount, clone, update
    }
})