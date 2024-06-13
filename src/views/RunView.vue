<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import IconDropdown from '@/components/icons/IconDropdown.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import UploadImageRun from '@/components/UploadImageRun.vue'

// Initialize the selected model with a default value
const model = ref('RT-DETR')
const modellist = ref(['RT-DETR', 'YOLOV8'])
// Initialize a reactive state for the dropdown visibility
const isDropdownOpen = ref(false)
const searchQuery = ref('')

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
onMounted(() => {
  window.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
})

// Computed property to filter models based on search query
const filteredModels = computed(() => {
  return modellist.value.filter((model) =>
    model.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <main class="flex-col">
    <div id="title">
      <div class="dropdown">
        <button class="dropbtn flex items-center justify-around" @click="toggleDropdown">
          {{ model }}
          <div class="w-1"></div>
          <IconDropdown />
        </button>
        <div class="dropdown-content" :class="{ show: isDropdownOpen }">
          <div class="serch-wrapper p-2">
            <IconSearch id="icon-serch" />
            <input type="text" v-model="searchQuery" placeholder="Search" class="dropdown-search" />
          </div>
          <a
            id=""
            v-for="modelItem in filteredModels"
            :key="modelItem"
            href="#"
            @click.prevent="selectModel(modelItem)"
          >
            {{ modelItem }}
          </a>
        </div>
      </div>
    </div>
    <UploadImageRun :Model="model" />
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
  margin: 30px;
}
.dropbtn {
  width: fit-content;
  height: 50px;
  padding: 16px;
  border-radius: 8px;
  text-align: start;
  display: flex;
  align-items: center;
  background-color: #eff1ff;
  margin-bottom: 8px;
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fefefe;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 100%; /* Position the dropdown below the button */
  border-radius: 10px;
  border: 1px solid #7585ff;
}
.dropdown-search {
  width: 100%;
  height: 38px;
  padding: 8px 8px 8px 22px;
  
  border-radius: 8px;
  background-color: #eff1ff;
  box-sizing: border-box;
  border: 1px solid #ddd;
}
.dropdown-search:focus {
  border: 1px solid #7585ff;
  outline: none; /* Remove default outline */
  background-color: #eff1ff;
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
  border-bottom: 1px solid #ddd; /* Add this line to set a bottom border */
}
.dropdown-content a:last-child {
  border-bottom: none; /* Remove border from the last <a> element */
}
.dropdown-content a:last-child:hover {
  border-bottom: none; /* Remove border from the last <a> element */
  border-radius: 0px 0px 10px 10px;
}
/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #eff1ff;
}
.dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
}
.serch-wrapper {
  position: relative;
}
#icon-serch {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-45%);
}
</style>
