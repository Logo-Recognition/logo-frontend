<script setup>
import OcrItem from '@/components/OcrItem.vue';
import UploadImageOcr from '@/components/UploadImageOcr.vue'
import IconShare from '@/components/icons/IconShare.vue'
import IconView from '@/components/icons/IconView.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import IconArrowL from '@/components/icons/IconArrowL.vue'
import IconArrowR from '@/components/icons/IconArrowR.vue'
import JSZip from 'jszip'
import { toast } from 'vue3-toastify'

import { ref } from 'vue';
const processed_data = ref([])
const currentImageIndex = ref(0)
const isShowAllImage = ref(false)
const isLoading = ref(false)

const onLoading = (data) => {
  isLoading.value = data
}

const onUpdateProcessedData = (data) => {
  processed_data.value = data
}

const showNextImage = () => {
  if (currentImageIndex.value < processed_data.value.length - 1) {
    currentImageIndex.value++
  }
}

const showPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}
const toggleShowAllImage = () => {
  isShowAllImage.value = !isShowAllImage.value
}

const setImageIndex = (index) => {
  currentImageIndex.value = index
}

const downloadAllImages = async () => {
  if (processed_data.value.length === 0) {
    toast.error('No images to download.', {
      autoClose: 3000
    })
    return
  }

  try {
    const zip = new JSZip()
    const folder = zip.folder('images')

    for (let i = 0; i < processed_data.value.length; i++) {
      const imageUrl = processed_data.value[i]['image_url']
      const imgfilename = `image_${i + 1}.jpg`
      const txtfilename = `image_${i + 1}.txt`
      const response = await fetch(imageUrl)
      const imageBlob = await response.blob()
      folder.file(imgfilename, imageBlob)
      folder.file(txtfilename, processed_data.value[i]['text'])
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

</script>

<template>
  <main class="flex-col py-10 px-10">
    <span id="title" class="text-lg font-medium">OCR</span>
    <UploadImageOcr @send-data="onUpdateProcessedData" @loading="onLoading"/>
    <div id="show-picture-card" v-if="processed_data.length > 0 || isLoading">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <span class="font-bold text-xl" >Result</span>
      </div>
      <p v-if="!isLoading">{{ currentImageIndex + 1 }} / {{ processed_data.length }}</p>
      <div class="navigation-buttons flex items-center">
        <button @click="toggleShowAllImage"><IconView /></button>
        <button @click="downloadAllImages"><IconShare /></button>
      </div>
    </div>
    <div class="show-predicted flex justify-between items-center p-4 h-72">
      <button @click="showPreviousImage"><IconArrowL/></button>
      <LoadingIndicator v-if="isLoading"/>
      <OcrItem v-else :image-src="processed_data[currentImageIndex]['image_url']" :text="processed_data[currentImageIndex]['text']"></OcrItem>
      <button @click="showNextImage"><IconArrowR/></button>
    </div>

    <div v-if="isShowAllImage && processed_data">
      <div class="preview-container">
        <div class="preview-area">
          <div v-for="(image, index) in processed_data" :key="index" class="preview-items">
            <img
              v-lazy="image['image_url']"
              class="preview-img"
              @click="setImageIndex(index)"
              crossorigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  </main>
</template>
<style scoped>
#show-picture-card{
  background-color: #FFFFFF;
  padding-inline: 32px;
  padding-block: 24px;
  border-radius: 16px
}
</style>
