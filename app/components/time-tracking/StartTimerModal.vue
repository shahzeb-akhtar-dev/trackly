<template>
  <UModal 
    v-model:open="isOpen" 
    :title="timerActive ? 'Active Timer' : 'Start Timer'" 
    :scrollable="true"
    class="bg-white min-w-4xl text-black"
    :transition="true"
    prevent-close
  >
    <!-- Timer Display (when active) -->
    <template v-if="timerActive" #body>
      <div class="p-6 space-y-6 ">
        <!-- Timer Display -->
        <div class="text-center space-y-4">
          <div class="text-6xl font-bold text-gray-900 font-mono tracking-tight">
            {{ formattedTime }}
          </div>
          <div class="space-y-2">
            <p class="text-lg font-semibold text-gray-900">
              {{ activeTask?.title }}
            </p>
            <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Icon name="heroicons:folder" class="w-4 h-4" />
              <span>{{ activeProject?.name }}</span>
            </div>
          </div>
        </div>

        <!-- Timer Controls -->
        <div class="flex items-center justify-center gap-3">
          <UButton
            v-if="isPaused"
            color="primary"
            size="lg"
            icon="heroicons:play-solid"
            @click="resumeTimer"
          >
            Resume
          </UButton>
          <UButton
            v-else
            color="secondary"
            size="lg"
            icon="heroicons:pause-solid"
            @click="pauseTimer"
          >
            Pause
          </UButton>
          
          <UButton
            color="error"
            size="lg"
            icon="heroicons:stop-solid"
            variant="outline"
            @click="stopTimer"
          >
            Stop
          </UButton>
        </div>

        <!-- Task Details -->
        <div class="pt-4 border-t border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600 mb-1">Started at</p>
              <p class="font-medium text-gray-900">{{ startTime }}</p>
            </div>
            <div>
              <p class="text-gray-600 mb-1">Estimated</p>
              <p class="font-medium text-gray-900">
                {{ activeTask?.estimatedHours || 'N/A' }}h
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Project/Task Selection (when inactive) -->
    <template v-else #body>
      <div class="flex gap-0 h-96">
        <!-- Left: Projects -->
        <div class="w-2/6 overflow-y-auto bg-gray-50 border-r border-gray-200">
          <div class="p-4 space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Projects
            </h3>
            <div class="space-y-1">
              <UButton
                v-for="project in projects"
                :key="project.id"
                :color="selectedProject?.id === project.id ? 'primary' : 'secondary'"
                :variant="selectedProject?.id === project.id ? 'soft' : 'ghost'"
                block
                class="justify-start"
                @click="selectProject(project)"
              >
                <template #leading>
                  <Icon :name="getProjectIcon(project.name)" class="w-4 h-4" />
                </template>
                <div class="flex-1 text-left min-w-0">
                  <p class="font-medium text-sm truncate">
                    {{ project.name }}
                  </p>
                  <p class="text-xs opacity-75">
                    {{ getProjectTaskCount(project.id) }} tasks
                  </p>
                </div>
              </UButton>
            </div>
          </div>
        </div>

        <!-- Right: Tasks -->
        <div class="flex-1 overflow-y-auto bg-white">
          <div class="p-4 space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Tasks
            </h3>
            <div class="space-y-1">
              <div v-if="!selectedProject" class="py-12 text-center">
                <Icon name="heroicons:arrow-left" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p class="text-sm text-gray-500">Select a project to view tasks</p>
              </div>
              
              <div v-else-if="availableTasks.length === 0" class="py-12 text-center">
                <Icon name="heroicons:inbox" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p class="text-sm text-gray-500">No available tasks</p>
              </div>
              
              <UButton
                v-for="task in availableTasks"
                v-else
                :key="task.id"
                :color="selectedTask?.id === task.id ? 'primary' : 'secondary'"
                :variant="selectedTask?.id === task.id ? 'soft' : 'ghost'"
                block
                class="justify-start h-auto py-3"
                @click="selectTask(task)"
              >
                <div class="flex-1 text-left min-w-0 space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="font-medium text-sm truncate">
                      {{ task.title }}
                    </p>
                    <UBadge
                      v-if="task.priority === 'high'"
                      color="error"
                      variant="subtle"
                      size="xs"
                    >
                      High
                    </UBadge>
                  </div>
                  <div class="flex items-center gap-3 text-xs opacity-75">
                    <span v-if="task.estimatedHours" class="flex items-center gap-1">
                      <Icon name="heroicons:clock" class="w-3 h-3" />
                      {{ task.estimatedHours }}h
                    </span>
                    <UBadge :color="getStatusColor(task.status) " variant="subtle" size="xs">
                      {{ task.status }}
                    </UBadge>
                  </div>
                </div>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div v-if="!timerActive" class="flex-1 min-w-0">
          <p v-if="selectedTask" class="text-sm font-medium truncate text-gray-900">
            {{ selectedTask.title }}
          </p>
          <p v-else class="text-sm text-gray-500">
            No task selected
          </p>
        </div>
        
        <div class="flex items-center gap-2 ml-auto">
          <UButton
            v-if="!timerActive"
            color="secondary"
            variant="ghost"
            @click="closeModal"
          >
            Cancel
          </UButton>
          <UButton
            v-if="!timerActive"
            color="primary"
            :disabled="!selectedTask"
            icon="heroicons:play-solid"
            @click="handleStart"
          >
            Start Timer
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { Project, Task } from '~/types/timer'

interface ProjectWithTasks extends Project {
  tasks: Task[]
}

interface Props {
  modelValue: boolean
  projects: ProjectWithTasks[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  start: [taskId: number, projectId: number]
  stop: [elapsedSeconds: number]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Timer state
const timerActive = ref(false)
const isPaused = ref(false)
const elapsedSeconds = ref(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const timerStartTime = ref<Date | null>(null)

// Selection state
const selectedProject = ref<ProjectWithTasks | null>(null)
const selectedTask = ref<Task | null>(null)
const activeProject = ref<ProjectWithTasks | null>(null)
const activeTask = ref<Task | null>(null)

// Computed
const availableTasks = computed(() => {
  if (!selectedProject.value) return []
  return selectedProject.value.tasks.filter(
    (task) => task.status === 'pending' || task.status === 'in_progress'
  )
})

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startTime = computed(() => {
  if (!timerStartTime.value) return '00:00:00'
  return timerStartTime.value.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
})

// Methods
const getProjectTaskCount = (projectId: number) => {
  const project = props.projects.find((p) => p.id === projectId)
  if (!project) return 0
  return project.tasks.filter(
    (task) => task.status === 'pending' || task.status === 'in_progress'
  ).length
}

const getProjectIcon = (projectName: string) => {
  const iconMap: Record<string, string> = {
    'Internal Projects': 'heroicons:folder',
    'Omega Corp': 'heroicons:briefcase',
    'Finance Dept': 'heroicons:building-office',
    'Marketing': 'heroicons:megaphone',
  }
  return iconMap[projectName] || 'heroicons:folder'
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'pending': 'secondary',
    'in_progress': 'primary',
    'completed': 'success',
  }
  return colorMap[status] || 'secondary' as any
}

const selectProject = (project: ProjectWithTasks) => {
  selectedProject.value = project
  selectedTask.value = null
}

const selectTask = (task: Task) => {
  selectedTask.value = task
}

const handleStart = () => {
  if (!selectedTask.value || !selectedProject.value) return
  
  activeTask.value = selectedTask.value
  activeProject.value = selectedProject.value
  timerActive.value = true
  isPaused.value = false
  elapsedSeconds.value = 0
  timerStartTime.value = new Date()
  
  startTimerInterval()
  emit('start', selectedTask.value.id, selectedProject.value.id)
}

const startTimerInterval = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timerInterval.value = setInterval(() => {
    if (!isPaused.value) {
      elapsedSeconds.value++
    }
  }, 1000)
}

const pauseTimer = () => {
  isPaused.value = true
}

const resumeTimer = () => {
  isPaused.value = false
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  
  emit('stop', elapsedSeconds.value)
  
  // Reset state
  timerActive.value = false
  isPaused.value = false
  elapsedSeconds.value = 0
  timerStartTime.value = null
  activeTask.value = null
  activeProject.value = null
  selectedProject.value = null
  selectedTask.value = null
}

const closeModal = () => {
  if (!timerActive.value) {
    isOpen.value = false
    selectedProject.value = null
    selectedTask.value = null
  }
}

// Cleanup
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// Watch for modal close
watch(isOpen, (newValue) => {
  if (!newValue && !timerActive.value) {
    selectedProject.value = null
    selectedTask.value = null
  }
})
</script>