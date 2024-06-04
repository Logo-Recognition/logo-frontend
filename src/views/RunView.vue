<script setup>
import { ref } from 'vue'

// Initialize the selected model with a default value
const model = ref('RT-DETR')

// Close the dropdown if the user clicks outside of it
function closeDropdown(event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content')
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i]
      if (openDropdown.style.display === 'block') {
        openDropdown.style.display = 'none'
      }
    }
  }
}

// Function to select a model
function selectModel(selectedModel) {
  model.value = selectedModel

  // Close the dropdown menu after selecting
  const dropdowns = document.getElementsByClassName('dropdown-content')
  for (let i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i]
    if (openDropdown.style.display === 'block') {
      openDropdown.style.display = 'none'
    }
  }
}

// Listen for clicks outside the dropdown
window.addEventListener('click', closeDropdown)
</script>

<template>
  <main id="" class="flex-col">
    <div>
      <H1>Classes</H1>
    </div>
    <div class="flex-col" id="class-box">
      <H2 class="font-bold mb-5">Select Model</H2>
      <div class="dropdown">
        <button class="dropbtn" id="selectedModel">{{ model }}</button>
        <div class="dropdown-content">
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

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  
}
</style>
