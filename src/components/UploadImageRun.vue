<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import PreviewImage from './PreviewImage.vue'
import { API_URL } from '@/config.js'
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const previewImages = ref([])
const fileInputRef = ref(null)

const closeModal = () => {
  emit('close')
  previewImages.value = []
}

const onUploadedSuccess = () => {
  toast.success('Images uploaded successfully!', {
    autoClose: 3000
  })
  emit('close')
  previewImages.value = []
}

const onUploadedFail = () => {
  toast.error('Failed to upload images.', {
    autoClose: 3000
  })
}

const onFileChange = (event) => {
  const files = event.target.files
  for (var index = 0; index < files.length; index++) {
    var reader = new FileReader()
    reader.onload = function (event) {
      const imageUrl = event.target.result
      previewImages.value.push(imageUrl)
    }
    reader.readAsDataURL(files[index])
  }
}

const sendImagesToServer = async () => {
  try {
    const images = previewImages.value.map((imageUrl) => {
      const byteString = atob(imageUrl.split(',')[1])
      const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([ab], { type: mimeString })
      const file = new File([blob], `image-${Date.now()}.${mimeString.split('/')[1]}`, {
        type: mimeString
      })
      return file
    })

    const formData = new FormData()
    images.forEach((file) => formData.append('files[]', file))

    const response = await fetch(`${API_URL}/api/upload-image`, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      console.log('Images uploaded successfully')
      onUploadedSuccess()
    } else {
      console.error('Error uploading images')
      onUploadedFail()
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}
const triggerFileInput = () => {
  fileInputRef.value.click()
}
</script>

<template>
  <div class="modal-content">
    <H2 class="font-bold mb-5">Upload Model</H2>
    <div class="upload-content content-around flex">
      <input
        class="file"
        ref="fileInputRef"
        type="file"
        multiple
        @change="onFileChange"
        accept="image/*"
      />
      <img alt="Upload image" class="m-5" src="@/assets/images/upload-btn.svg" width="90" />
      <div class="content-around">
        <p class="text-[#052443]">Upload or Drop image here</p>
        <p class="text-[#7E7E7E]">Limit JNG,JPG,JPEG</p>
      </div>
      <button class="browse-button content-center justify-self-end" @click="triggerFileInput">
        Browse files
      </button>
    </div>
    <div v-if="previewImages.length > 0" class="preview-container">
      <div v-if="previewImages" class="preview-area">
        <div v-for="(image, index) in previewImages" :key="index" class="preview-items">
          <PreviewImage :src="image" @img-removed="removeImage(index)"></PreviewImage>
        </div>
      </div>
    </div>
    <div class="flex flex-row pt-5">
      <button class="save-button" @click="sendImagesToServer">Save</button>
      <button class="cancel-button" @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<style>
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

.modal-content {
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

.upload-content {
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

.file {
  opacity: 0;
  width: 65%;
  height: 88px;
  position: absolute;
  cursor: pointer;
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

.save-button {
  width: 144px;
  height: 32px;
  border-radius: 8px;
  background-color: #48a393;
  color: #fefefe;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16px;
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
