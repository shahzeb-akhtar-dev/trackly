<template>
  <div class="menu-section">
    <!-- Section Header with Toggle -->
    <button
      class="menu-section__header"
      @click="$emit('toggle')"
      :aria-expanded="isExpanded"
    >
      <span class="menu-section__title">{{ section.label }}</span>
      <svg
        class="menu-section__chevron"
        :class="{ 'menu-section__chevron--open': isExpanded }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Menu Items Container -->
    <div
      class="menu-section__content"
      :class="{ 'menu-section__content--open': isExpanded }"
    >
      <slot name="items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/layout'

interface Props {
  section: NavigationItem
  isExpanded: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<style scoped lang="postcss">
/* =========================================
   MENU SECTION COMPONENT - STYLES
========================================= */

.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(var(--color-text-main));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: rgb(var(--color-surface-alt));
    color: rgb(var(--color-primary));
  }
}

.menu-section__title {
  flex: 1;
  text-align: left;
}

.menu-section__chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
  color: rgb(var(--color-text-muted));
}

.menu-section__chevron--open {
  transform: rotate(180deg);
}

.menu-section__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all var(--transition-base);
}

.menu-section__content--open {
  max-height: 500px;
  opacity: 1;
  padding: 4px 0 8px 0;
}
</style>
