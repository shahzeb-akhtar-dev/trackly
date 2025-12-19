<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Start Timer</h2>
          <button
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            @click="handleClose"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden flex">
          <!-- Left: Projects -->
          <div class="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div class="p-4">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Projects</h3>
              <div class="space-y-1">
                <button
                  v-for="project in projects"
                  :key="project.id"
                  class="w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left"
                  :class="
                    selectedProject?.id === project.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  "
                  @click="selectProject(project)"
                >
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="
                      selectedProject?.id === project.id
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    "
                  >
                    <Icon :name="getProjectIcon(project.name)" class="w-5 h-5" :class="selectedProject?.id === project.id ? 'text-white' : 'text-gray-600'" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="font-medium text-sm truncate"
                      :class="selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-900'"
                    >
                      {{ project.name }}
                    </p>
                    <p
                      class="text-xs mt-1"
                      :class="selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-500'"
                    >
                      {{ getProjectTaskCount(project.id) }} active tasks
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Tasks -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-4">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Available Tasks</h3>
              <p v-if="!selectedProject" class="text-sm text-gray-500 mb-4">
                Select a project to view tasks
              </p>
              <p v-else-if="availableTasks.length === 0" class="text-sm text-gray-500 mb-4">
                No tasks available for {{ selectedProject.name }}
              </p>
              <div v-else class="space-y-2">
                <label
                  v-for="task in availableTasks"
                  :key="task.id"
                  class="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2"
                  :class="
                    selectedTask?.id === task.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50 border-transparent'
                  "
                >
                  <input
                    type="radio"
                    :value="task.id"
                    :checked="selectedTask?.id === task.id"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    @change="selectTask(task)"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <p
                        class="font-medium text-sm"
                        :class="selectedTask?.id === task.id ? 'text-blue-600' : 'text-gray-900'"
                      >
                        {{ task.title }}
                      </p>
                      <span
                        v-if="task.priority === 'high'"
                        class="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700"
                      >
                        High Priority
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mb-2">{{ task.description }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span v-if="task.estimatedHours" class="flex items-center gap-1">
                        <Icon name="heroicons:clock" class="w-4 h-4" />
                        {{ task.estimatedHours }}h est
                      </span>
                      <span v-if="task.assignedToYou" class="flex items-center gap-1">
                        <Icon name="heroicons:user" class="w-4 h-4" />
                        Assigned to you
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600" />
              <div>
                <p class="text-sm font-semibold text-gray-900">Ready to Start Tracking</p>
                <p v-if="selectedTask" class="text-sm text-gray-600">{{ selectedTask.title }}</p>
                <p v-else class="text-sm text-gray-400">Select a task to begin</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                @click="handleClose"
              >
                Cancel
              </button>
              <button
                class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!selectedTask"
                @click="handleStart"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Project, Task } from '~/types/timer'

interface ProjectWithTasks extends Project {
  tasks: Task[]
}

interface Props {
  isOpen: boolean
  projects: ProjectWithTasks[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  start: [taskId: number]
}>()

const selectedProject = ref<ProjectWithTasks | null>(null)
const selectedTask = ref<Task | null>(null)

const availableTasks = computed(() => {
  if (!selectedProject.value) return []
  return selectedProject.value.tasks.filter(
    (task) => task.status === 'pending' || task.status === 'in_progress'
  )
})

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

const selectProject = (project: ProjectWithTasks) => {
  selectedProject.value = project
  selectedTask.value = null
}

const selectTask = (task: Task) => {
  selectedTask.value = task
}

const handleClose = () => {
  selectedProject.value = null
  selectedTask.value = null
  emit('close')
}

const handleStart = () => {
  if (selectedTask.value) {
    emit('start', selectedTask.value.id)
    handleClose()
  }
}
</script>

