<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
<script setup>
const colorMode = useColorMode();
colorMode.preference = "light";
</script>
