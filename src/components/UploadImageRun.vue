<script setup>
import { ref, defineEmits } from 'vue'
import { toast } from 'vue3-toastify'
import PreviewImage from './PreviewImage.vue'
import axios from 'axios'
import { API_URL } from '@/config.js'

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

const emits = defineEmits(['uploading-completed'])

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
  showDropdown.value = false
  const formData = new FormData()
  formData.append(
    'detection_model',
    props.Model === 'RT-DETR' ? 'rtdetr' : props.Model.toLowerCase()
  )
  formData.append(
    'classification_model',
    props.classModel === 'EfficientNet' ? 'efficientnet' : props.classModel.toLowerCase()
  )
  previewImages.value.forEach((image) => {
    formData.append('images', image.file)
  })

  isLoading.value = true

  try {
    const response = await axios.post(`${API_URL}/api/model/run-realtime`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Server response:', response.data)

    const urls = response.data.map((item) => item.predicted_url)
    const heaturls = response.data.map((item) => item.heatmap_url)
    processedImageUrls.value = urls
    DefaultUrls.value = urls
    CamdUrls.value = heaturls

    uploadMessage.value = 'Images uploaded successfully!'
    emits('uploading-completed', processedImageUrls.value)
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
</script>

<template>
  <!-- Modal content for uploading images -->
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
  margin-left: auto !important;
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
</style>
