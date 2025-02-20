<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import IconDropdown from '@/assets/icons/IconDropdown.vue'
import IconSearch from '@/assets/icons/IconSearch.vue'
import IconToArrow from '@/assets/icons/IconToArrow.vue'
import UploadImageRun from '@/components/UploadImageRun.vue'
import ScrapeData from '@/components/ScrapeData.vue'

const model = ref('RT-DETR')
const classmodel = ref('Mobilenetv3')
const detectionModel = ref(['RT-DETR', 'YOLOV8', 'YOLOV10'])
const classificationModel = ref(['Mobilenetv3', 'Efficientnetv2', 'Inceptionv2'])

const isDropdownOpenModel = ref(false)
const isDropdownOpenClass = ref(false)
const searchQueryModel = ref('')
const searchQueryClass = ref('')

const activeTab = ref('upload')

function toggleDropdownModel() {
  isDropdownOpenModel.value = !isDropdownOpenModel.value
}

function toggleDropdownClass() {
  isDropdownOpenClass.value = !isDropdownOpenClass.value
}

// Function to select a model and close the dropdown
function selectModel(selectedModel) {
  model.value = selectedModel
  isDropdownOpenModel.value = false
}

function selectClass(selectedClass) {
  classmodel.value = selectedClass
  isDropdownOpenClass.value = false
}

// Close the dropdown if the user clicks outside of it
function closeDropdown(event) {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpenModel.value = false
  }
}

function closeDropdownClass(event) {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpenClass.value = false
  }
}

// Listen for clicks outside the dropdown
onMounted(() => {
  window.addEventListener('click', closeDropdown)
  window.addEventListener('click', closeDropdownClass)
})

// Clean up event listener on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
  window.removeEventListener('click', closeDropdownClass)
})

// Computed property to filter models based on search query
const filteredModels = computed(() => {
  return detectionModel.value.filter((model) =>
    model.toLowerCase().includes(searchQueryModel.value.toLowerCase())
  )
})
const filteredClass = computed(() => {
  return classificationModel.value.filter((classmodel) =>
    classmodel.toLowerCase().includes(searchQueryClass.value.toLowerCase())
  )
})
</script>

<template>
  <div class="flex-col">
    <div id="title">
      <h3 class="font-bold mb-5">Select Model</h3>
      <div class="flex justify-between">
        <div class="dropdown flex-row" id="Model-Dropdown">
          <div id="ModelTitilText">Detection Model</div>
          <div>
            <button class="dropbtn flex items-center" @click="toggleDropdownModel">
              {{ model }}
              <div class="w-1"></div>
              <IconDropdown />
            </button>

            <!-- Dropdown content -->
            <div class="dropdown-content" :class="{ show: isDropdownOpenModel }">
              <!-- Search input -->
              <div class="search-wrapper p-2">
                <IconSearch id="icon-serch" />
                <!-- Search icon -->
                <input
                  type="text"
                  v-model="searchQueryModel"
                  placeholder="Search"
                  class="dropdown-search"
                />
              </div>

              <!-- List of model options -->
              <a
                v-for="classItem in filteredModels"
                :key="classItem"
                href="#"
                @click.prevent="selectModel(classItem)"
              >
                {{ classItem }}
              </a>
            </div>
          </div>
        </div>

        <IconToArrow class="self-center" />
        <div class="dropdown flex" id="Class-Dropdown">
          <div id="ModelTitilText">Classification Model</div>
          <div>
            <!-- Dropdown toggle button -->
            <button class="dropbtn flex items-center justify-around" @click="toggleDropdownClass">
              {{ classmodel }}
              <div class="w-1"></div>
              <IconDropdown />
              <!-- Icon for dropdown -->
            </button>

            <!-- Dropdown content -->
            <div class="dropdown-content" :class="{ show: isDropdownOpenClass }">
              <!-- Search input -->
              <div class="search-wrapper p-2">
                <IconSearch id="icon-serch" />
                <!-- Search icon -->
                <input
                  type="text"
                  v-model="searchQueryClass"
                  placeholder="Search"
                  class="dropdown-search"
                />
              </div>

              <!-- List of model options -->
              <a
                v-for="classItem in filteredClass"
                :key="classItem"
                href="#"
                @click.prevent="selectClass(classItem)"
              >
                {{ classItem }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="title">
      <div class="flex border rounded-lg bg-gray-100 w-fit">
        <button
          :class="[
            'px-4 py-2 font-semibold rounded-lg',
            activeTab === 'upload' ? 'bg-white text-black shadow' : 'text-gray-500'
          ]"
          @click="activeTab = 'upload'"
        >
          Upload Image
        </button>
        <button
          :class="[
            'px-4 py-2 font-semibold rounded-lg',
            activeTab === 'scrape' ? 'bg-white text-black shadow' : 'text-gray-500'
          ]"
          @click="activeTab = 'scrape'"
        >
          Scrape Image
        </button>
      </div>

      <div class="mt-4">
        <UploadImageRun v-if="activeTab === 'upload'" :Model="model" :classModel="classmodel" />
        <ScrapeData v-if="activeTab === 'scrape'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for the component */

.flex-col {
  overflow: auto;
}

/* Styling for the title section */
#title {
  font-size: 16px;
  font-weight: 500;
  gap: 0px;
  margin: 30px;
}

/* Styling for the dropdown button */
.dropbtn {
  width: fit-content;
  height: 50px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 8px;
  text-align: start;
  font-size: 0.875rem;
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
  /* min-width: 160px; */
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

/* Show dropdown content when isDropdownOpenModel is true */
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
  flex-direction: row;
  align-items: center;
}

/* Styles for search wrapper */
.search-wrapper {
  position: relative;
}

/* Search icon positioning */
#icon-serch {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-45%);
}

#ModelTitilText {
  color: #7e7e7e;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.02em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  margin-right: 20px;
}

#title {
  width: 95%; /* Adjust the width percentage as needed */
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
}
</style>
