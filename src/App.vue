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
    <RouterView />
    <ModalUploadImage 
      :is-open="showModal"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.app{
  display: flex;
  flex-direction: row;
}
</style>
