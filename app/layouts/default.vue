<template>
  <ClientOnly>
    <div class="flex h-screen bg-gray-100 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <div 
        class="flex flex-col flex-1 overflow-hidden transition-all duration-300 ml-64 lg:ml-64 max-lg:ml-0"
      >
        <!-- Header -->
        <Header />

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto pt-16">
          <div class="p-6 max-w-7xl mx-auto w-full md:p-8">
            <NuxtPage />
          </div>
        </main>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
import Header from '~/components/layout/Header.vue'
</script>
