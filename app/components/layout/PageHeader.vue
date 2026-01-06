<template>
  <div class="border-b border-gray-200 bg-white">
    <div class="px-4 lg:px-6 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            {{ title }}
          </h1>
          <p v-if="description" class="text-gray-600 text-sm mt-1">
            {{ description }}
          </p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>
