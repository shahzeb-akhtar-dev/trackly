<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Requests</h3>
      <button class="text-blue-600 hover:text-blue-700 transition-colors">
        <Icon name="heroicons:plus" class="w-5 h-5" />
      </button>
    </div>

    <!-- Summary Stats -->
    <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
      <div class="flex items-center gap-1">
        <span class="text-xs font-semibold text-gray-500">PEND</span>
        <span class="text-sm font-bold text-gray-900">{{ pendingCount }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-xs font-semibold text-gray-500">APPR</span>
        <span class="text-sm font-bold text-gray-900">{{ approvedCount }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-xs font-semibold text-gray-500">REJ</span>
        <span class="text-sm font-bold text-gray-900">{{ rejectedCount }}</span>
      </div>
    </div>

    <!-- Requests List -->
    <div class="space-y-3">
      <div
        v-for="(request, index) in requests"
        :key="index"
        class="flex items-center justify-between py-2"
      >
        <p class="text-sm text-gray-700 flex-1">{{ request.title }}</p>
        <span
          class="px-2 py-1 text-xs font-semibold rounded-full"
          :class="getStatusClass(request.status)"
        >
          {{ request.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Request {
  title: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

interface Props {
  requests: Request[]
}

const props = defineProps<Props>()

const pendingCount = computed(() => 
  props.requests.filter(r => r.status === 'Pending').length
)

const approvedCount = computed(() => 
  props.requests.filter(r => r.status === 'Approved').length
)

const rejectedCount = computed(() => 
  props.requests.filter(r => r.status === 'Rejected').length
)

const getStatusClass = (status: string) => {
  const classes = {
    Pending: 'bg-amber-50 text-amber-700',
    Approved: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-red-50 text-red-700',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-50 text-gray-700'
}
</script>

