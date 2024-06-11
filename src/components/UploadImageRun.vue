<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import PreviewImage from './PreviewImage.vue'
import axios from 'axios'
import IconShare from '@/components/icons/IconShare.vue'
import IconView from '@/components/icons/IconView.vue'
import JSZip from 'jszip'
const props = defineProps({
  Model: {
    type: String,
    required: true
  }
})
const previewImages = ref([])
const fileInputRef = ref(null)
const active = ref(false)
const viewMode = ref('single') // New state to manage view mode
const uploadMessage = ref('')
const processedImageUrls = ref([])
const isLoading = ref(false)
const currentImageIndex = ref(0)

const selectedModel = ref('')

const toggleActive = (isActive) => {
  active.value = isActive
}

const onUploadedSuccess = () => {
  toast.success('Images uploaded successfully!', {
    autoClose: 3000
  })
}

const onUploadedFail = () => {
  toast.error('Failed to upload images.', {
    autoClose: 3000
  })
}

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

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}

const clearImage = () => {
  previewImages.value = []
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const uploadImage = async () => {
  if (previewImages.value.length === 0) {
    return
  }

  const formData = new FormData()
  previewImages.value.forEach((image) => {
    formData.append('images', image.file)
  })
  formData.append('model', props.Model === 'RT-DETR' ? 'rtdetr' : props.Model.toLowerCase())
  isLoading.value = true

  try {
    const response = await axios.post('http://192.168.2.44:5000/api/model/run-realtime', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    uploadMessage.value = 'Images uploaded successfully!'
    console.log('Server response:', response)
    processedImageUrls.value = response.data.processed_image_urls
    onUploadedSuccess()
  } catch (error) {
    uploadMessage.value = 'Error uploading images.'
    console.error('Error uploading images:', error)
    onUploadedFail()
  } finally {
    isLoading.value = false
    currentImageIndex.value = 0
    selectedModel.value = props.Model
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
  }
}

const showPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'single' ? 'grid' : 'single'
}
</script>

<template>
  <div class="modal-content-run">
    <H2 class="font-bold mb-5">Upload Images</H2>
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

    <div v-if="previewImages.length > 0" class="preview-container">
      <div v-if="previewImages" class="preview-area">
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
  <div id="show-picture-card" v-if="processedImageUrls.length > 0">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h3>Result</h3>
        <p class="text-[#5A5D6C]">{{ selectedModel }}</p>
      </div>
      <p>{{ currentImageIndex + 1 }} / {{ processedImageUrls.length }}</p>
      <div class="navigation-buttons flex items-center">
        <button @click="toggleViewMode"><IconView /></button>
        <button @click="downloadAllImages"><IconShare /></button>
      </div>
    </div>
    <div v-if="viewMode === 'single'" class="flex justify-around">
      <button @click="showPreviousImage">&lt;</button>
      <img
        :src="processedImageUrls[currentImageIndex]"
        :alt="'Processed Image ' + currentImageIndex"
        crossorigin="anonymous"
      />
      <button @click="showNextImage">&gt;</button>
    </div>
    <div v-else class="grid-container">
      <div v-for="(image, index) in processedImageUrls" :key="index" class="grid-item">
        <img :src="image" :alt="'Processed Image ' + index" crossorigin="anonymous" />
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

.preview-area {
  display: inline-flex;
}

.preview-items {
  width: 150px;
  height: 100px;
  margin-right: 16px;
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
#show-picture-card img {
  width: 70%; /* Limit the maximum width */
  height: 400px; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the entire image fits within the set dimensions */
  /* border-radius: 16px; */
  border: 1px dashed #3745be;
  padding: auto;
}
.grid-container {
  width: 70%; /* Limit the maximum width */
  height: 400px; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the entire image fits within the set dimensions */
  /* border-radius: 16px; */
  border: 1px dashed #3745be;
  padding: auto;
}
.grid-item{
  width: 50px; /* Limit the maximum width */
  height: 50px; /* Maintain aspect ratio */
}
</style>
