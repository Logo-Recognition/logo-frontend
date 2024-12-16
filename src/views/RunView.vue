<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import IconDropdown from '@/components/icons/IconDropdown.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import UploadImageRun from '@/components/UploadImageRun.vue'
// Initialize the selected model with a default value
const model = ref('RT-DETR')
const modellist = ref(['RT-DETR', 'YOLOV8', 'YOLOV10'])

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

// Clean up event listener on component unmount
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
  <div class="flex-col">
    <div id="title">
      <!-- Dropdown component -->
      <div class="dropdown">
        <!-- Dropdown toggle button -->
        <button class="dropbtn flex items-center justify-around" @click="toggleDropdown">
          {{ model }}
          <div class="w-1"></div>
          <IconDropdown />
          <!-- Icon for dropdown -->
        </button>

        <!-- Dropdown content -->
        <div class="dropdown-content" :class="{ show: isDropdownOpen }">
          <!-- Search input -->
          <div class="serch-wrapper p-2">
            <IconSearch id="icon-serch" />
            <!-- Search icon -->
            <input type="text" v-model="searchQuery" placeholder="Search" class="dropdown-search" />
          </div>

          <!-- List of model options -->
          <a
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

    <!-- Child component that depends on selected model -->
    <UploadImageRun :Model="model" />
    <div></div>
  </div>
</template>

<style scoped>
/* Scoped styles for the component */

.flex-col {
  overflow: auto;
}

/* Styling for the title section */
#title {
  font-size: 18px;
  font-weight: 500;
  gap: 0px;
  margin: 30px;
}

/* Styling for the dropdown button */
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

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fefefe;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 100%; /* Position the dropdown below the button */
  border-radius: 10px;
  border: 1px solid #7585ff; /* Border style */
}

/* Search input styles */
.dropdown-search {
  width: 100%;
  height: 38px;
  padding: 8px 8px 8px 22px;
  border-radius: 8px;
  background-color: #eff1ff;
  box-sizing: border-box;
  border: 1px solid #ddd;
}

/* Focus styles for search input */
.dropdown-search:focus {
  border: 1px solid #7585ff;
  outline: none; /* Remove default outline */
  background-color: #eff1ff;
}

/* Show dropdown content when isDropdownOpen is true */
.dropdown-content.show {
  display: block;
}

/* Styles for links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #ddd; /* Add this line to set a bottom border */
}

/* Remove border from the last link element */
.dropdown-content a:last-child {
  border-bottom: none;
}

/* Hover styles for links inside the dropdown */
.dropdown-content a:hover {
  background-color: #eff1ff;
}

/* Dropdown container styling */
.dropdown {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Styles for search wrapper */
.serch-wrapper {
  position: relative;
}

/* Search icon positioning */
#icon-serch {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-45%);
}
</style>
