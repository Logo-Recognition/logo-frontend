<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue';
import SideBar from '@/components/SideBar.vue'
import ModalUploadImage from './components/ModalUploadImage.vue';
const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}


</script>

<template>
  <div class="app">
    <SideBar @open-modal="openModal"/>
    <div class="content">
      <RouterView />
    </div>
    <ModalUploadImage 
      :is-open="showModal"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.content {
  flex-grow: 1;
  overflow: auto;
}
</style>
