import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../pages/Home.vue') },
    { path: '/tasks', component: () => import('../pages/Tasks.vue') },
    { path: '/tasks/new', component: () => import('../pages/TaskCreate.vue') },
    { path: '/tasks/:id/edit', component: () => import('../pages/TaskEdit.vue') },
  ],
})

export default router
