<template>
  <div class="layout">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="layout__content">
      <!-- Header -->
      <Header />

      <!-- Page Content -->
      <main class="layout__main">
        <div class="layout__page">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue'
import Header from '~/components/layout/Header.vue'
</script>

<style scoped lang="postcss">
.layout {
  display: flex;
  height: 100vh;
  background-color: rgb(var(--color-surface));
  overflow: hidden;
}

.layout__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  margin-left: var(--layout-sidebar-width);
  transition: margin-left var(--transition-base);

  @media (max-width: 1024px) {
    margin-left: 0;
  }
}

.layout__main {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--layout-header-height);
}

.layout__page {
  padding: 24px;
  max-width: var(--layout-content-max-width);
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
}
</style>
