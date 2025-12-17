<template>
  <div class="mb-6">
    <!-- Section Title -->
    <h3 v-if="title" class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {{ title }}
    </h3>

    <!-- Menu Items (Slot) -->
    <div class="space-y-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<style scoped>
/* MenuSection component styles */
</style>
