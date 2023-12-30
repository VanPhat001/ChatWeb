<template>
    <div class="login-view !h-screen bg-white flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="onLogin">
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username address</label>
                    <div class="mt-2">
                        <input v-model="username" tabindex="1" autofocus id="username" name="username" type="username"
                            autocomplete="username"
                            class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input ref="passwordEl" v-model="password" tabindex="1" id="password" name="password"
                            type="password" autocomplete="current-password"
                            class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <button tabindex="2" type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                        in</button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm text-gray-500">
                Not a member?
                {{ ' ' }}
                <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Create new account!</a>
            </p>
        </div>
    </div>
</template>
  

<script setup>
import { useRouter } from 'vue-router'
import axiosConfig from '@/axiosConfig'
import { inject, ref } from 'vue'
import { useAccountStore } from '@/stores/account';
import { useSocketStore } from '@/stores/socket';

const router = useRouter()
const passwordEl = ref(null)
const username = ref('user')
const password = ref('1234')
const cookies = inject('$cookies')
const accountStore = useAccountStore()
const socketStore = useSocketStore()


function resetPassword() {
    password.value = ''
    passwordEl.value.focus()
}

function onLogin() {
    axiosConfig().post('/login', {
        username: username.value,
        password: password.value
    })
        .then(result => {
            const data = result.data
            const { status, accessToken } = data

            if (status == 'success') {
                cookies.set('access_token', accessToken, '7d')
                accountStore.fetchAccount(accessToken)
                socketStore.connectToSocketServer()
                socketStore.registerClientInfo(accountStore._id)
                router.push({ name: 'home' })
            } else {
                alert('Tài khoản hoặc mật khẩu không hợp lệ!')
                resetPassword()
            }

        })
        .catch(err => {
            console.log(err)
            alert('Có lỗi xảy ra, hãy thử lại sau...')
            resetPassword()
        })
}
</script>