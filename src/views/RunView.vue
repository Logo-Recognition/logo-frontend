<script setup>
import { ref } from 'vue'

// Initialize the selected model with a default value
const model = ref('RT-DETR')
// Initialize a reactive state for the dropdown visibility
const isDropdownOpen = ref(false)

// Function to toggle the dropdown visibility
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Function to select a model and close the dropdown
function selectModel(selectedModel) {
  model.value = selectedModel
  isDropdownOpen.value = false
}

// Close the dropdown if the user clicks outside of it
function closeDropdown(event) {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpen.value = false
  }
}

// Listen for clicks outside the dropdown
window.addEventListener('click', closeDropdown)
</script>

<template>
  <main id="" class="flex-col">
    <div id="title">
      <H1>Classes</H1>
    </div>
    <div class="flex-col" id="class-box">
      <H2 class="font-bold mb-5">Select Model</H2>
      <div class="dropdown">
        <button class="dropbtn" id="selectedModel" @click="toggleDropdown">{{ model }}</button>
        <div class="dropdown-content" :class="{ show: isDropdownOpen }">
          <a href="#" @click.prevent="selectModel('RT-DETR')">RT-DETR</a>
          <a href="#" @click.prevent="selectModel('Option 2')">Option 2</a>
          <a href="#" @click.prevent="selectModel('Option 3')">Option 3</a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
#class-box {
  width: 95%; /* Adjust the width percentage as needed */
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
}
#title {
  font-size: 18px;
  font-weight: 500;
  gap: 0px;
  opacity: 0px;
  margin: 30px;
}
.dropbtn {
  width: 1000px;
  height: 58px;
  padding: 16px;
  gap: 0px;
  border-radius: 8px;
  opacity: 0px;
  background: #eff1ff;
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  width: 1000px;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
/* Show the dropdown menu when isDropdownOpen is true */
.dropdown-content.show {
  display: block;
}
/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
</style>