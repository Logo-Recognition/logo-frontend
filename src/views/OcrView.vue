<script setup>
import OcrItem from '@/components/OcrItem.vue';
import UploadImageOcr from '@/components/UploadImageOcr.vue'
import IconShare from '@/components/icons/IconShare.vue'
import IconView from '@/components/icons/IconView.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { ref } from 'vue';
const processed_data = ref([])
const currentImageIndex = ref(0)
const isShowAllImage = ref(false)
const isLoading = ref(false)
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

</script>

<template>
  <main class="flex-col py-10 px-10">
    <span id="title" class="text-lg font-medium">OCR</span>
    <UploadImageOcr @send-data="onUpdateProcessedData"/>
    <LoadingIndicator/>
    <div id="show-picture-card" v-if="processed_data.length > 0">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <h3>Result</h3>
      </div>
      <p>{{ currentImageIndex + 1 }} / {{ processed_data.length }}</p>
      <div class="navigation-buttons flex items-center">
        <button @click="toggleShowAllImage"><IconView /></button>
        <button @click="downloadAllImages"><IconShare /></button>
      </div>
    </div>
    <div class="show-predicted flex justify-around p-4">
      <button @click="showPreviousImage">&lt;</button>
      
      <OcrItem :image-src="processed_data[currentImageIndex]['image_url']" :text="processed_data[currentImageIndex]['text']"></OcrItem>
      <button @click="showNextImage">&gt;</button>
    </div>

    <div v-if="showAllImage">
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
</style>
