<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import PreviewImage from './PreviewImage.vue'
import axios from 'axios'

const previewImages = ref([])
const fileInputRef = ref(null)
const active = ref(false)
const emit = defineEmits(['send-data'])
const uploadMessage = ref('')
const isLoading = ref(false)
const selectedFile = ref()

const toggleActive = (isActive) => {
  active.value = isActive
}

const onUploadedSuccess = () => {
  toast.success('Images uploaded successfully!', {
    autoClose: 3000
  })
  previewImages.value = []
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
      previewImages.value.push(imageUrl)
    }
    reader.readAsDataURL(files[index])
  }
  selectedFile.value = Array.from(files)
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const uploadImage = async () => {
  if (selectedFile.value.length === 0) {
    return
  }

  const formData = new FormData()
  selectedFile.value.forEach((file) => {
    formData.append('images', file)
  })
  isLoading.value = true

  try {
    const response = await axios.post('http://192.168.2.44:5000/api/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    uploadMessage.value = 'Images uploaded successfully!'
    console.log('Server response:', response)
    emit('send-data',response.data)
    onUploadedSuccess()
  } catch (error) {
    uploadMessage.value = 'Error uploading images.'
    console.error('Error uploading images:', error)
    onUploadedFail()
  } finally {
    isLoading.value = false
    selectedFile.value = []
    previewImages.value = []
  }
}

</script>

<template>
  <div class="modal-content-ocr">
    <h2 class="font-bold mb-5">Upload Image</h2>
    <div
      @dragenter.prevent="toggleActive(true)"
      @dragleave.prevent="toggleActive(false)"
      @dragover.prevent
      @drop.prevent="onFileChange"
      :class="{ 'active-dropzone': active }"
    >
      <div class="upload-content-ocr content-around flex">
        <input
          class="file-ocr"
          ref="fileInputRef"
          type="file"
          multiple
          @change="onFileChange"
          accept="image/*"
        />
        <img alt="Upload image" class="m-5" src="@/assets/images/upload-btn.svg" width="90" />
        <div class="content-around">
          <p class="text-[#052443]">Upload or Drop image here</p>
          <p class="text-[#7E7E7E]">Limit PNG, JPG, JPEG</p>
        </div>

        <button class="browse-button content-center justify-self-end" @click="triggerFileInput">
          Browse files
        </button>
      </div>
    </div>

    <div v-if="previewImages.length > 0" class="preview-container">
      <div v-if="previewImages" class="preview-area">
        <div v-for="(image, index) in previewImages" :key="index" class="preview-items">
          <PreviewImage :src="image" @img-removed="removeImage(index)"></PreviewImage>
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <button class="create-button" @click="uploadImage">Create</button>
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

.modal-content-ocr {
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  margin-inline: 32px;
  margin-block: 24px;
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

.upload-content-ocr {
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

.file-ocr {
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
  height: 40px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #7585ff;
  color: #fefefe;
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
</style>
