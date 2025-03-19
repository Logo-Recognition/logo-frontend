<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { toast } from 'vue3-toastify'
import JSZip from 'jszip'
import IconDropdown from '@/assets/icons/IconDropdown.vue'
import IconSearch from '@/assets/icons/IconSearch.vue'
import IconToArrow from '@/assets/icons/IconToArrow.vue'
import UploadImageRun from '@/components/UploadImageRun.vue'
import ScrapeData from '@/components/ScrapeData.vue'
import IconDownload from '@/assets/icons/IconDownload.vue'
import IconView from '@/assets/icons/IconView.vue'
import IconArrowL from '@/assets/icons/IconArrowL.vue'
import IconArrowR from '@/assets/icons/IconArrowR.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const detectionModel = ref(['RT-DETR', 'YOLOV8', 'YOLOV10'])
const classificationModel = ref(['EfficientNet', 'ConVnext', 'MobileNet', 'Custom'])

const selectedDetectionModel = ref('RT-DETR')
const selectedClassificationModel = ref('EfficientNet')

const isDropdownOpenModel = ref(false)
const isDropdownOpenClass = ref(false)
const searchQueryModel = ref('')
const searchQueryClass = ref('')

const processedImageUrls = ref([])
const isLoading = ref(false)
const activeTab = ref('upload')

const currentImageIndex = ref(0)

const filteredModels = computed(() => {
  return detectionModel.value.filter((selectedDetectionModel) =>
    selectedDetectionModel.toLowerCase().includes(searchQueryModel.value.toLowerCase())
  )
})
const filteredClass = computed(() => {
  return classificationModel.value.filter((selectedClassificationModel) =>
    selectedClassificationModel.toLowerCase().includes(searchQueryClass.value.toLowerCase())
  )
})

function selectModel(selectedModel) {
  selectedDetectionModel.value = selectedModel
  isDropdownOpenModel.value = false
}

function selectClass(selectedClass) {
  selectedClassificationModel.value = selectedClass
  isDropdownOpenClass.value = false
}

const handleUploadedImages = (imageUrls) => {
  console.log('Received images from child:', imageUrls)
  processedImageUrls.value = imageUrls
}

const scrapingCompleted = (imageUrls) => {
  processedImageUrls.value = imageUrls
  isLoading.value = false
}

function toggleDropdownModel() {
  isDropdownOpenModel.value = !isDropdownOpenModel.value
}
function toggleDropdownClass() {
  isDropdownOpenClass.value = !isDropdownOpenClass.value
}

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

const downloadAllImages = async () => {
  if (processedImageUrls.value.length === 0) {
    toast.error('No images to download.', {
      autoClose: 3000
    })
    return
  }

  try {
    const zip = new JSZip()
    const folder = zip.folder('images')

    for (let i = 0; i < processedImageUrls.value.length; i++) {
      const imageUrl = processedImageUrls.value[i]
      const filename = `image_${i + 1}.jpg`

      const response = await fetch(imageUrl)
      const imageBlob = await response.blob()
      folder.file(filename, imageBlob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = window.URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'images.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Images downloaded successfully!', {
      autoClose: 3000
    })
  } catch (error) {
    toast.error('Error downloading images.', {
      autoClose: 3000
    })
    console.error('Error downloading images:', error)
  }
}

const showNextImage = () => {
  if (currentImageIndex.value < processedImageUrls.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const showPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = processedImageUrls.value.length - 1
  }
}

const setImageIndex = (index) => {
  currentImageIndex.value = index
}

onMounted(() => {
  window.addEventListener('click', closeDropdown)
  window.addEventListener('click', closeDropdownClass)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
  window.removeEventListener('click', closeDropdownClass)
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
              {{ selectedDetectionModel }}
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
            <button class="dropbtn flex items-center justify-around" @click="toggleDropdownClass">
              {{ selectedClassificationModel }}
              <div class="w-1"></div>
              <IconDropdown />
            </button>

            <div class="dropdown-content" :class="{ show: isDropdownOpenClass }">
              <div class="search-wrapper p-2">
                <IconSearch id="icon-serch" />
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
        <UploadImageRun
          v-if="activeTab === 'upload'"
          :Model="selectedDetectionModel"
          :classModel="selectedClassificationModel"
          @uploading-completed="handleUploadedImages"
        />
        <ScrapeData v-if="activeTab === 'scrape'" @scraping-completed="scrapingCompleted" />
      </div>
    </div>

    <!-- Display while images are being processed -->
    <div v-if="isLoading">
      <div id="show-picture-card">
        <div class="flex justify-between">
          <div class="flex flex-col">
            <h3>Result</h3>
          </div>
          <div class="navigation-buttons flex items-center">
            <button
              @click="toggleDropdown"
              :class="{ active: showDropdown }"
              id="predicted-bar-button"
              disabled
            >
              <IconView />
            </button>
            <button @click="downloadAllImages" disabled><IconDownload /></button>
          </div>
        </div>
        <div class="show-predicted flex justify-around">
          <div id="the-predicted-image" class="grid place-content-center">
            <LoadingIndicator />
          </div>
        </div>
      </div>
    </div>

    <!-- Display after images are processed -->
    <div v-if="processedImageUrls.length > 0">
      <div id="show-picture-card" v-if="processedImageUrls.length > 0">
        <div class="flex justify-between items-center">
          <div class="flex items-center flex-1">
            <div class="flex flex-col">
              <h3>Result</h3>
              <p class="text-[#5A5D6C]">
                {{ selectedDetectionModel }} -> {{ selectedClassificationModel }}
              </p>
            </div>
          </div>

          <div class="flex-1 text-center">
            <p>{{ currentImageIndex + 1 }} / {{ processedImageUrls.length }}</p>
          </div>

          <div class="navigation-buttons flex items-center flex-1 justify-end">
            <button
              @click="toggleDropdown"
              :class="{ active: showDropdown }"
              id="predicted-bar-button"
            >
              <IconView />
            </button>
            <button @click="downloadAllImages"><IconDownload /></button>
          </div>
        </div>
        <div class="show-predicted flex justify-around">
          <button @click="showPreviousImage"><IconArrowL /></button>
          <img
            v-lazy="processedImageUrls[currentImageIndex]"
            :alt="'Processed Image ' + currentImageIndex"
            crossorigin="anonymous"
            id="the-predicted-image"
          />
          <button @click="showNextImage"><IconArrowR /></button>
        </div>
        <div v-if="showDropdown" class="mt-2">
          <div class="preview-container">
            <div class="preview-area">
              <div v-for="(image, index) in processedImageUrls" :key="index" class="preview-items">
                <img
                  v-lazy="image"
                  class="preview-img"
                  @click="setImageIndex(index)"
                  crossorigin="anonymous"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-col {
  overflow: visible;
}

#title {
  font-size: 16px;
  font-weight: 500;
  gap: 0px;
  margin: 30px;
}

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

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fefefe;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 100%;
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
  outline: none;
  background-color: #eff1ff;
}

.dropdown-content.show {
  display: block;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #ddd;
}

.dropdown-content a:last-child {
  border-bottom: none;
}

.dropdown-content a:hover {
  background-color: #eff1ff;
}

.dropdown {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-wrapper {
  position: relative;
}

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
  width: 95%;
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
}

#show-picture-card {
  width: 95%;
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
  background-color: #ffffff;
}

#show-picture-card h3 {
  font-size: 20px;
  font-weight: 700;
}

#the-predicted-image {
  width: 70%;
  height: 400px;
  object-fit: contain;
  border: 1px dashed #3745be;
  padding: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
}

.grid-item {
  width: 100%;
  height: auto;
  padding: 5px;
}

.grid-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.dropdown-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 300px; 
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  z-index: 1000;
}

.dropdown-item {
  width: 50px;
  height: 50px;
  margin: 5px;
  cursor: pointer;
}

.dropdown-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-area {
  display: inline-flex; 
  gap: 10px;
}

.preview-items {
  flex: 0 0 auto;
}

.preview-img {
  border-radius: 10px;
  width: 150px;
  height: 100px;
  object-fit: fill;
  cursor: pointer;
  margin-top: 5px;
}

#predicted-bar-button {
  color: #5a5d6c;
}

#predicted-bar-button.active {
  color: #7585ff;
}
</style>
