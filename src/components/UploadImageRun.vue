<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import PreviewImage from './PreviewImage.vue'
import axios from 'axios'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconView from '@/components/icons/IconView.vue'
import CamSelect from '@/components/CamSelect.vue'
import IconArrowL from '@/components/icons/IconArrowL.vue'
import IconArrowR from '@/components/icons/IconArrowR.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import JSZip from 'jszip'
const apiUrl = import.meta.env.VITE_API_HOST;

// Props received from parent component
const props = defineProps({
  Model: {
    type: String,
    required: true
  },
  classModel: {
    type: String,
    required: true
  }
})

// Reactive variables declaration
const previewImages = ref([])
const fileInputRef = ref(null)
const active = ref(false)
const uploadMessage = ref('')
const processedImageUrls = ref([])
const isLoading = ref(false)
const currentImageIndex = ref(0)
const showDropdown = ref(false)
const selectedModel = ref('')
const DefaultUrls = ref([])
const CamdUrls = ref([])

// Function to toggle dropzone state
const toggleActive = (isActive) => {
  active.value = isActive
}

// Function to display toast on successful upload
const onUploadedSuccess = () => {
  toast.success('Images uploaded successfully!', {
    autoClose: 3000
  })
}

// Function to display toast on upload failure
const onUploadedFail = () => {
  toast.error('Failed to upload images.', {
    autoClose: 3000
  })
}

// Function to handle file input changes
const onFileChange = (event) => {
  const files = event.target.files || event.dataTransfer.files
  for (let index = 0; index < files.length; index++) {
    const reader = new FileReader()
    reader.onload = function (event) {
      const imageUrl = event.target.result
      previewImages.value.push({
        file: files[index],
        url: imageUrl
      })
    }
    reader.readAsDataURL(files[index])
  }
}

// Function to remove an image from preview
const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}

// Function to clear all previewed images
const clearImage = () => {
  previewImages.value = []
}

// Function to trigger file input dialog
const triggerFileInput = () => {
  fileInputRef.value.click()
}

// Function to upload images to the server
const uploadImage = async () => {
  if (previewImages.value.length === 0) {
    return
  }
  showDropdown.value = false
  const formData = new FormData()
  formData.append(
    'detection_model',
    props.Model === 'RT-DETR' ? 'rtdetr' : props.Model.toLowerCase()
  )
  formData.append('classification_model', props.classModel.toLowerCase())
  previewImages.value.forEach((image) => {
    formData.append('images', image.file)
  })
  // formData.append('model', props.Model === 'RT-DETR' ? 'rtdetr' : props.Model.toLowerCase())

  isLoading.value = true

  try {
    const response = await axios.post(`${apiUrl}/api/model/run-realtime`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Assume response.data is an array of objects as per your example
    console.log('Server response:', response.data)

    // Extract predicted_url(s) from the response
    const urls = response.data.map((item) => item.predicted_url)
    const heaturls = response.data.map((item) => item.heatmap_url)
    processedImageUrls.value = urls
    DefaultUrls.value = urls
    CamdUrls.value = heaturls

    uploadMessage.value = 'Images uploaded successfully!'
    onUploadedSuccess()
  } catch (error) {
    uploadMessage.value = 'Error uploading images.'
    console.error('Error uploading images:', error)
    processedImageUrls.value = []
    previewImages.value = []
    onUploadedFail()
  } finally {
    isLoading.value = false
    currentImageIndex.value = 0
    selectedModel.value = props.Model
  }
}

// Function to download all processed images as a ZIP file
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

// Function to show the next processed image
const showNextImage = () => {
  if (currentImageIndex.value < processedImageUrls.value.length - 1) {
    currentImageIndex.value++
  }
}

// Function to show the previous processed image
const showPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Function to set the current image index
const setImageIndex = (index) => {
  currentImageIndex.value = index
}

// Function to toggle dropdown visibility
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleTabChange = (tab) => {
  console.log('Tab changed to:', tab)
  if (tab === 'cam') {
    processedImageUrls.value = CamdUrls.value
  } else {
    processedImageUrls.value = DefaultUrls.value
  }
}
</script>

<template>
  <!-- Modal content for uploading images -->
  <div class="modal-content-run">
    <h2 class="font-bold mb-5">Upload Images</h2>
    <div
      @dragenter.prevent="toggleActive(true)"
      @dragleave.prevent="toggleActive(false)"
      @dragover.prevent
      @drop.prevent="onFileChange"
      :class="{ 'active-dropzone': active }"
    >
      <div class="upload-content-run content-around flex">
        <input
          class="file-run"
          ref="fileInputRef"
          type="file"
          multiple
          @change="onFileChange"
          accept="image/*"
        />
        <img alt="Upload image" class="m-5" src="@/assets/images/upload-btn.svg" width="90" />
        <div class="content-around">
          <p class="text-[#052443]">Upload or Drop image here</p>
          <p class="text-[#7E7E7E]">Limit PNG,JPG,JPEG</p>
        </div>

        <button class="browse-button content-center justify-self-end" @click="triggerFileInput">
          Browse files
        </button>
      </div>
    </div>

    <!-- Display preview of uploaded images -->
    <div v-if="previewImages.length > 0" class="preview-container">
      <div class="preview-area">
        <div v-for="(image, index) in previewImages" :key="index" class="preview-items">
          <PreviewImage :src="image.url" @img-removed="removeImage(index)"></PreviewImage>
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <button class="create-button" @click="uploadImage">Create</button>
      <button class="clear-button ml-1" @click="clearImage">Clear</button>
    </div>
  </div>

  <!-- Display while images are being processed -->
  <div v-if="isLoading">
    <div id="show-picture-card">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <h3>Result</h3>
          <p class="text-[#5A5D6C]">{{ props.Model }}</p>
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
        <div id="the-predicted-image" class="grid place-content-center"><LoadingIndicator /></div>
      </div>
    </div>
  </div>

  <!-- Display after images are processed -->
  <div v-else>
    <div id="show-picture-card" v-if="processedImageUrls.length > 0">
      <div class="flex justify-between items-center">
        <div class="flex items-center flex-1">
          <div class="flex flex-col">
            <h3>Result</h3>
            <p class="text-[#5A5D6C]">{{ selectedModel }}</p>
          </div>
          <div v-if="selectedModel == 'YOLOV8'">
            <CamSelect @tab-changed="handleTabChange" />
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
</template>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content-run {
  width: 95%; /* Adjust the width percentage as needed */
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
}

.browse-button {
  width: 124px;
  height: 40px;
  border-radius: 8px;
  opacity: 0px;
  background: #7585ff;
  color: #fefefe;
  margin-left: auto !important; /* Pushes the button to the end of the flex container */
  margin-right: 20px !important;
  margin: auto;
  padding: auto;
}

.upload-content-run {
  background-color: #eff1ff;
  box-shadow: 0px 1px 5px 0px #64748b1f;
  border-radius: 8px;
  margin-bottom: 20px;
  height: 88px;
  flex-direction: row;
}

.drop-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8.66px;
  border: 1px dashed #9e9e9e;
  margin: 24px;
  position: relative;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.drop-area:hover {
  border: 1px dashed #0d4f72;
}

.file-run {
  display: none;
}

.preview-container {
  overflow-x: auto;
  white-space: nowrap;
  margin-inline: 24px;
  margin-bottom: 24px;
}

.create-button {
  width: 124px;
  height: 32px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #7585ff;
  color: #fefefe;
  padding: auto;
}

.clear-button {
  width: 124px;
  height: 32px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #fefefe;
  color: #7e7e7e;
  border: 1px solid #7e7e7e;
  padding: auto;
}

.cancel-button {
  width: 72px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e83550;
  color: #e83550;
  background-color: #fff1f1;
  font-size: 12px;
  font-weight: 600;
}

#show-picture-card {
  width: 95%; /* Adjust the width percentage as needed */
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
  width: 70%; /* Limit the maximum width */
  height: 400px; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the entire image fits within the set dimensions */
  /* border-radius: 16px; */
  border: 1px dashed #3745be;
  padding: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
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
  max-width: 300px; /* Adjust as needed */
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
  display: inline-flex; /* Use flexbox layout */
  gap: 10px; /* Add spacing between items */
}

.preview-items {
  flex: 0 0 auto; /* Prevent items from shrinking */
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
