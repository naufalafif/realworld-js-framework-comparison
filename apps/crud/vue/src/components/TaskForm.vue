<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { taskSchema, type TaskFormData } from '../schemas/task'
import type { Category } from '../../../../../shared/types'

const props = defineProps<{
  categories: Category[]
  defaultValues?: Partial<TaskFormData>
  isSubmitting?: boolean
}>()

const emit = defineEmits<{ submit: [data: TaskFormData] }>()

const { defineField, handleSubmit, errors } = useForm<TaskFormData>({
  validationSchema: toTypedSchema(taskSchema),
  initialValues: {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    categoryId: 1,
    ...props.defaultValues,
  },
})

const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [status, statusAttrs] = defineField('status')
const [priority, priorityAttrs] = defineField('priority')
const [categoryId, categoryIdAttrs] = defineField('categoryId')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4 max-w-lg">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input v-model="title" v-bind="titleAttrs" class="w-full px-3 py-2 border rounded text-sm" />
      <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea v-model="description" v-bind="descriptionAttrs" rows="3" class="w-full px-3 py-2 border rounded text-sm" />
      <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select v-model="status" v-bind="statusAttrs" class="w-full px-3 py-2 border rounded text-sm bg-white">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select v-model="priority" v-bind="priorityAttrs" class="w-full px-3 py-2 border rounded text-sm bg-white">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select v-model="categoryId" v-bind="categoryIdAttrs" class="w-full px-3 py-2 border rounded text-sm bg-white">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <button type="submit" :disabled="isSubmitting"
      class="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
      {{ isSubmitting ? 'Saving...' : 'Save Task' }}
    </button>
  </form>
</template>
