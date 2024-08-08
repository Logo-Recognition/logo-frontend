<template>
  <div class="bar-container">
    <div
      class="bar-item"
      :class="{ active: activeTab === 'default' }"
      @click="activeTab = 'default'"
    >
      Default
    </div>
    <div class="bar-item" :class="{ active: activeTab === 'cam' }" @click="activeTab = 'cam'">
      CAM
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('default')
</script>

<style scoped>
.bar-container {
  display: flex;
  justify-content: center;
  width: 146px;
  height: 35px;
  border-radius: 16px;
  background-color: #020c1d
}

.bar-item {
  background-color: #020c1d;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 74px;
  height: 30px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
}

.bar-item.active {
  background-color: #7585FF;
}
</style>
