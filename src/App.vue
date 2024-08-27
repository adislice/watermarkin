<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <nav class="px-6 lg:px-20 flex w-full h-16 items-center border-b">
    <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-fuchsia-400">
      Watermark.in
    </h1>
  </nav>
  <main class="mx-auto lg:px-16">
    <RouterView />
  </main>
</template>
