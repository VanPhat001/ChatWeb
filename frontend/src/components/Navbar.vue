<template>
    <div class="navbar flex justify-center py-2">
        <router-link to="/" title="home" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
            <Icon name="dashicons:admin-home" size="28"></Icon>
        </router-link>

        <router-link to="/chat" title="chat" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
            <Icon name="dashicons:format-chat" size="28"></Icon>
        </router-link>

        <router-link to="/" title="friends" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
            <Icon name="pepicons-pop:people" size="28"></Icon>
        </router-link>

        <router-link to="/login" title="log out" class="px-3 py-1 rounded-sm hover:bg-gray-700 mx-1">
            <Icon name="oi:account-logout" size="28"></Icon>
        </router-link>
    </div>
</template>