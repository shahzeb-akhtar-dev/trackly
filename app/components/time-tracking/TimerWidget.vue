<template>
  <!-- Block Variant - Dashboard -->
  <div
    v-if="variant === 'block'"
    class="w-full bg-white border border-gray-200 rounded-xl p-8"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-sm font-medium text-gray-600">Current Session</h3>
      <span
        v-if="hasActiveTimer"
        class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full"
      >
        ACTIVE
      </span>
    </div>

    <!-- Task Title -->
    <h2 class="text-2xl font-bold text-gray-900 mb-8">
      {{ timerComposable.activeTimer.value?.task?.title || "Task Not Started" }}
    </h2>

    <!-- Timer Display -->
    <div class="flex items-center justify-center gap-3 mb-10">
      <!-- Hours -->
      <div class="flex flex-col items-center">
        <div
          class="w-20 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <span class="text-3xl font-bold text-gray-900">{{ hours }}</span>
        </div>
        <span class="text-xs font-medium text-gray-500 uppercase mt-2"
          >Hours</span
        >
      </div>

      <!-- Separator -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-bold text-gray-400">:</span>
        <span class="text-2xl font-bold text-gray-400">:</span>
      </div>

      <!-- Minutes -->
      <div class="flex flex-col items-center">
        <div
          class="w-20 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          <span class="text-3xl font-bold text-gray-900">{{ minutes }}</span>
        </div>
        <span class="text-xs font-medium text-gray-500 uppercase mt-2"
          >Minutes</span
        >
      </div>

      <!-- Separator -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-bold text-gray-400">:</span>
        <span class="text-2xl font-bold text-gray-400">:</span>
      </div>

      <!-- Seconds -->
      <div class="flex flex-col items-center">
        <div
          class="w-20 h-20 flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm"
        >
          <span class="text-3xl font-bold text-blue-600">{{ seconds }}</span>
        </div>
        <span class="text-xs font-medium text-blue-600 uppercase mt-2"
          >Seconds</span
        >
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="timerComposable.error.value"
      class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-sm text-red-600">{{ timerComposable.error.value }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <!-- Start/Break Button -->
      <UButton
        v-if="!hasActiveTimer"
        variant="solid"
        size="lg"
        block
        icon="heroicons:play"
        @click="showStartModal = true"
      >
        Start
      </UButton>

      <UButton
        v-else
        color="neutral"
        variant="solid"
        size="lg"
        block
        :disabled="isLoading"
        :icon="isPaused ? 'heroicons:play' : 'heroicons:pause'"
        @click="handleBreak"
      >
        {{ isPaused ? "Resume" : "Break" }}
      </UButton>

      <!-- Stop Button -->
      <UButton
        color="error"
        variant="solid"
        size="lg"
        block
        :disabled="!hasActiveTimer || isLoading"
        icon="heroicons:stop"
        @click="handleStop"
      >
        Stop
      </UButton>
    </div>
  </div>

  <!-- Inline Variant - Header -->
  <div
    v-if="variant === 'inline'"
    class="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
  >
    <!-- Start Button -->
    <!-- Active Timer Display -->

    <span class="text-sm text-gray-700 font-medium truncate max-w-37.5">
      {{
        timerComposable.activeTimer.value?.task?.title || "Task Not Selected"
      }}
    </span>
    <span class="text-gray-900 font-bold text-sm tabular-nums">
      {{ hours }}:{{ minutes }}:{{ seconds }}
    </span>
    <div class="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
      <UButton
        v-if="!hasActiveTimer"
        color="primary"
        variant="ghost"
        size="xs"
        square
        icon="heroicons:play"
        @click="showStartModal = true"
      />

      <UButton
        v-else
        color="primary"
        variant="ghost"
        size="xs"
        square
        :disabled="isLoading"
        :icon="isPaused ? 'heroicons:play' : 'heroicons:pause'"
        @click="handleBreak"
        :title="isPaused ? 'Resume timer' : 'Take a break'"
      />
      <UButton
        color="error"
        variant="ghost"
        size="xs"
        square
        :disabled="!hasActiveTimer || isLoading"
        icon="heroicons:stop"
        @click="handleStop"
        title="Stop timer"
      />
    </div>
  </div>

  <!-- Start Timer Modal -->
  <StartTimerModal
    :model-value="showStartModal"
    :projects="mockProjects"
    @update:model-value="showStartModal = $event"
    @start="handleStartTimer"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useTimer } from "~/composables/time-tracking/useTimer";
import StartTimerModal from "./StartTimerModal.vue";
import type { Project, Task } from "~/types/timer";

interface Props {
  variant: "block" | "inline";
}

defineProps<Props>();

const timerComposable = useTimer();

const showStartModal = ref(false);

const mockProjects = ref([
  {
    id: 1,
    name: "Internal Projects",
    tasks: [
      {
        id: 1,
        title: "Design System Update",
        description:
          "Review and merge the new component updates for the dashboard UI kit.",
        status: "in_progress" as const,
        priority: "high" as const,
        estimatedHours: 2,
        assignedToYou: true,
      },
      {
        id: 2,
        title: "Weekly Team Sync",
        description: "Mandatory meeting for all engineering staff.",
        status: "pending" as const,
        estimatedHours: 0.5,
        assignedToYou: false,
      },
      {
        id: 3,
        title: "Documentation Review",
        description: "Update the API documentation with new endpoints.",
        status: "pending" as const,
        estimatedHours: 4,
        assignedToYou: false,
      },
    ],
  },
  {
    id: 2,
    name: "Omega Corp",
    tasks: [
      {
        id: 4,
        title: "Client Meeting",
        description: "Discuss project requirements and timeline.",
        status: "in_progress" as const,
        estimatedHours: 1,
        assignedToYou: true,
      },
    ],
  },
  {
    id: 3,
    name: "Finance Dept",
    tasks: [
      {
        id: 5,
        title: "Budget Review",
        description: "Review quarterly budget allocations.",
        status: "pending" as const,
        estimatedHours: 3,
        assignedToYou: false,
      },
    ],
  },
  {
    id: 4,
    name: "Marketing",
    tasks: [
      {
        id: 6,
        title: "Campaign Planning",
        description: "Plan Q2 marketing campaigns.",
        status: "in_progress" as const,
        estimatedHours: 5,
        assignedToYou: true,
      },
    ],
  },
]);

const isLoading = timerComposable.loading;
const isPaused = timerComposable.isPaused;
const hasActiveTimer = computed(
  () => timerComposable.activeTimer.value !== null
);

// Use formattedTime from store for consistency
const formattedTime = timerComposable.formattedTime;
const hours = computed(() => formattedTime.value.hours);
const minutes = computed(() => formattedTime.value.minutes);
const seconds = computed(() => formattedTime.value.seconds);

const handleBreak = async () => {
  if (isPaused.value) {
    await timerComposable.resumeTimer();
  } else {
    await timerComposable.pauseTimer();
  }
};

const handleStop = async () => {
  const timeLog = await timerComposable.stopTimer();
  if (timeLog) {
    console.log("Time log created:", timeLog);
  }
};

const handleStartTimer = async (taskId: number) => {
  // Find the task from mock projects
  let taskTitle = "Task";
  for (const project of mockProjects.value) {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      taskTitle = task.title;
      break;
    }
  }
  await timerComposable.startTimer(taskId, taskTitle);
  showStartModal.value = false;
};

onMounted(async () => {
  // No need to fetch active timer, store handles it
});

onUnmounted(() => {
  // No cleanup needed, store persists
});

watch(
  () => timerComposable.error.value,
  () => {
    if (timerComposable.error.value) {
      setTimeout(() => timerComposable.clearError(), 5000);
    }
  }
);
</script>
