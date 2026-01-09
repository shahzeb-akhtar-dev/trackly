<template>
  <div
    :class="['p-4 rounded-lg border', containerClass, colorClasses.container]"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <Icon
        :name="icon"
        :class="['w-5 h-5 mt-0.5 flex-shrink-0', colorClasses.icon]"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 :class="['font-semibold', colorClasses.title]">
          {{ title }}
        </h3>

        <p v-if="message" :class="['text-sm mt-1', colorClasses.message]">
          {{ message }}
        </p>

        <p v-if="details" class="text-xs mt-2 text-gray-500 font-mono">
          {{ details }}
        </p>

        <!-- Actions -->
        <div v-if="showActions" class="flex items-center gap-2 mt-3">
          <UButton
            v-if="allowRetry"
            :icon="retryIcon"
            :color="variant"
            variant="soft"
            size="xs"
            :loading="retrying"
            @click="handleRetry"
          >
            {{ retryText }}
          </UButton>

          <slot name="actions" />
        </div>
      </div>

      <!-- Dismiss button -->
      <UButton
        v-if="dismissible"
        icon="i-heroicons-x-mark-20-solid"
        :color="variant"
        variant="ghost"
        size="sm"
        @click="handleDismiss"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

export interface ErrorStateProps {
  // Content
  title?: string;
  message?: string|null;
  details?: string;

  // Icon
  icon?: string;

  // Variant/Styling
  variant?: "error" | "warning" | "info";
  containerClass?: string;

  // Actions
  dismissible?: boolean;
  allowRetry?: boolean;
  retryText?: string;
  retryIcon?: string;
  onRetry?: () => void | Promise<void>;
  onDismiss?: () => void;
}

const props = withDefaults(defineProps<ErrorStateProps>(), {
  title: "Error",
  variant: "error",
  containerClass: "",
  dismissible: true,
  allowRetry: false,
  retryText: "Try Again",
  retryIcon: "i-heroicons-arrow-path-20-solid",
});

const emit = defineEmits<{
  dismiss: [];
  retry: [];
}>();

const retrying = ref(false);

// Variant color mappings
const variantMap = {
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-600",
    title: "text-red-900",
    message: "text-red-700",
  },
  warning: {
    container: "bg-orange-50 border-orange-200",
    icon: "text-orange-600",
    title: "text-orange-900",
    message: "text-orange-700",
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-900",
    message: "text-blue-700",
  },
};

// Default icons by variant
const defaultIcons = {
  error: "i-heroicons-exclamation-circle-20-solid",
  warning: "i-heroicons-exclamation-triangle-20-solid",
  info: "i-heroicons-information-circle-20-solid",
};

const colorClasses = computed(() => variantMap[props.variant]);
const icon = computed(() => props.icon || defaultIcons[props.variant]);
const showActions = computed(() => props.allowRetry || !!useSlots().actions);

const handleDismiss = () => {
  if (props.onDismiss) {
    props.onDismiss();
  }
  emit("dismiss");
};

const handleRetry = async () => {
  retrying.value = true;
  try {
    if (props.onRetry) {
      await props.onRetry();
    }
    emit("retry");
  } finally {
    retrying.value = false;
  }
};
</script>
