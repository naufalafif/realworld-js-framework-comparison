<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/tasks', label: 'Tasks' },
  { path: '/tasks/new', label: 'New Task' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b">
      <div class="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
        <span class="font-bold text-lg text-gray-900">Task Manager</span>
        <span v-html="'<svg viewBox=&quot;0 0 261.76 226.69&quot; width=&quot;20&quot; height=&quot;20&quot;><path d=&quot;m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z&quot; fill=&quot;#41B883&quot;/><path d=&quot;m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z&quot; fill=&quot;#34495E&quot;/></svg>'"></span>
        <div class="flex gap-4 ml-4">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="['text-sm', route.path === item.path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900']"
          >
            {{ item.label }}
          </RouterLink>
        </div>
        <a href="http://localhost:1355" class="ml-auto text-xs text-gray-400 hover:text-gray-600">← Dashboard</a>
      </div>
    </nav>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
