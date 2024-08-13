<template>
    <div class="bar-container">
      <div
        class="bar-item"
        :class="{ active: activeTab === 'default' }"
        @click="updateTab('default')"
      >
        Default
      </div>
      <div
        class="bar-item"
        :class="{ active: activeTab === 'cam' }"
        @click="updateTab('cam')"
      >
        CAM
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue'
  
  // Define emits
  const emit = defineEmits(['tab-changed'])
  
  const activeTab = ref('default')
  
  // Function to update tab and emit an event
  const updateTab = (tab) => {
    activeTab.value = tab;
    emit('tab-changed', tab); // Emit event to parent component
  }
  </script>
  
  <style scoped>
  .bar-container {
    display: flex;
    justify-content: center; /* Centers the bar-item horizontally */
    align-items: center; /* Centers the bar-item vertically */
    width: 148px;
    height: 30px;
    border-radius: 16px;
    margin-left: 30px;
    background-color: #020c1d;
  }
  
  .bar-item {
    background-color: #020c1d;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 70px;
    height: 25px;
    border-radius: 16px;
    display: flex;
    align-items: center; /* Centers text vertically */
    justify-content: center; /* Centers text horizontally */
  }
  
  .bar-item.active {
    background-color: #7585FF;
  }
  </style>
  