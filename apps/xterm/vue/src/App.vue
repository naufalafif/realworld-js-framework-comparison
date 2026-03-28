<script setup lang="ts">
import TerminalComponent from './components/Terminal.vue'
</script>

<template>
  <div class="h-screen bg-gray-900 flex flex-col overflow-hidden">
    <div class="flex items-center gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
      <h1 class="text-lg font-bold text-green-400">Terminal</h1>
      <span v-html="'<svg viewBox=&quot;0 0 261.76 226.69&quot; width=&quot;20&quot; height=&quot;20&quot;><path d=&quot;m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z&quot; fill=&quot;#41B883&quot;/><path d=&quot;m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z&quot; fill=&quot;#34495E&quot;/></svg>'"></span>
      <a href="http://localhost:1355" class="ml-auto text-xs text-gray-500 hover:text-gray-300">← Dashboard</a>
    </div>
    <div class="flex-1 min-h-0">
      <TerminalComponent ws-url="ws://localhost:3200" />
    </div>
  </div>
</template>
