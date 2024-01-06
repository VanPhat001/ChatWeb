import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
      children: [
        {
          path: 'list',
          name: 'friend-list',
          component: () => import('../views/FriendListView.vue')
        },
        {
          path: 'suggest',
          name: 'friend-suggest',
          component: () => import('../views/FriendSuggestView.vue')
        }
      ]
    },
    {
      path: '/profile/:id?',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/post/:id?',
      name: 'post',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/call/:partnerId',
      name: 'call',
      component: () => import('../views/CallView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('../views/ErrorView.vue')
    }
  ]
})

export default router
