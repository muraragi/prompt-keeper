<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
// Removed theme toggle imports and logic

onMounted(() => {
  // Always apply dark theme on mount
  document.documentElement.classList.add('dark')
})
</script>
