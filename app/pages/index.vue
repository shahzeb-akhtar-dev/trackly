<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="flex items-center justify-center gap-3 mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Icon name="mdi:check" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-5xl font-bold text-gray-900">Trackly</h1>
        </div>
        <p class="text-xl text-gray-600 mb-8">Your gateway to seamless productivity and project management</p>
        <NuxtLink
          to="/auth/login"
          class="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page component
</script>
