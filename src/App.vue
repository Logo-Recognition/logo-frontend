<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import SideBar from '@/components/SideBar.vue'
import ModalUploadImage from './components/ModalUploadImage.vue'
const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="app bg-grey-background">
    <SideBar @open-modal="openModal" />
    <div class="content-container">
      <RouterView />
      <ModalUploadImage :is-open="showModal" @close="closeModal" />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
