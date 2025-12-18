<template>
  <component
    :is="item.route ? 'NuxtLink' : 'button'"
    :to="item.route"
    class="nav-item"
    :class="{
      'nav-item--active': active,
      'nav-item--child': isChild,
    }"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <!-- Icon -->
    <svg
      v-if="item.icon"
      class="nav-item__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path :d="getNavIcon(item.icon)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    <!-- Label -->
    <span class="nav-item__label">{{ item.label }}</span>

    <!-- Badge -->
    <span v-if="item.badge" class="nav-item__badge" :class="`nav-item__badge--${item.badge.variant}`">
      {{ item.badge.value }}
    </span>
  </component>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/layout'
import { useNavigation } from '~/composables/layout/useNavigation'

interface Props {
  item: NavigationItem
  active?: boolean
  isChild?: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
}>()

const navigation = useNavigation()

const getNavIcon = (iconName: string) => {
  return navigation.getIconPath(iconName)
}
</script>

<style scoped lang="postcss">
/* =========================================
   NAV ITEM COMPONENT - STYLES
========================================= */

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(var(--color-text-main));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  text-align: left;

  &:hover {
    background-color: rgb(var(--color-surface-alt));
    color: rgb(var(--color-primary));
  }

  &:focus-visible {
    outline: 2px solid rgb(var(--color-primary));
    outline-offset: -2px;
  }
}

.nav-item--active {
  background-color: rgba(var(--color-primary), 0.12);
  color: rgb(var(--color-primary));
  font-weight: 600;

  &:hover {
    background-color: rgba(var(--color-primary), 0.16);
  }
}

.nav-item--child {
  padding-left: 44px;
  font-size: 13px;
}

.nav-item__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: currentColor;
}

.nav-item__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background-color: rgb(var(--ui-color-error-500));
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.nav-item__badge--success {
  background-color: rgb(var(--ui-color-success-500));
}

.nav-item__badge--warning {
  background-color: rgb(var(--ui-color-warning-500));
}

.nav-item__badge--error {
  background-color: rgb(var(--ui-color-error-500));
}

.nav-item__badge--info {
  background-color: rgb(var(--ui-color-info-500));
}
</style>
