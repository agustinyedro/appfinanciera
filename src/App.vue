<template>
  <div class="min-h-screen bg-base-200 text-base-content font-sans">
    <Sidebar />
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <Header />
      <main class="flex-grow p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
    <FAB />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import FAB from './components/FAB.vue'
</script>

<style>
  .font-sans {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
</style>
