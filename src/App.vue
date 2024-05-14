<script setup>
import { RouterView } from 'vue-router'
import SideBar from '@/components/SideBar.vue'

</script>

<template>
  <div class="app">
    <SideBar />
    <RouterView />
  </div>
</template>

<style scoped>
.app{
  display: flex;
  flex-direction: row;
}

</style>
