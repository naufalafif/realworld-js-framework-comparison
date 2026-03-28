<script setup lang="ts">
import { onUpdated } from 'vue'

const props = defineProps<{
  depth: number
  value: number
}>()

const emit = defineEmits<{
  'leaf-render': []
}>()

onUpdated(() => {
  if (props.depth <= 0) {
    emit('leaf-render')
  }
})
</script>

<template>
  <span v-if="depth <= 0" class="text-xs text-gray-500">Leaf: {{ value }}</span>
  <div v-else :style="{ paddingLeft: '1px' }">
    <DeepNode :depth="depth - 1" :value="value" @leaf-render="$emit('leaf-render')" />
  </div>
</template>
