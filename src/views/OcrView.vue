<script setup>
import OcrItem from '@/components/OcrItem.vue';
import UploadImageOcr from '@/components/UploadImageOcr.vue'
import { ref } from 'vue';
const processed_data = ref([])
const onUpdateProcessedData = (data) => {
  processed_data.value = data
}


</script>

<template>
  <main class="flex-col py-10 px-10">
    <span id="title" class="text-lg font-medium">OCR</span>
    <UploadImageOcr @send-data="onUpdateProcessedData"/>
    <div v-for="(item, index) in processed_data" :key="index">
      <OcrItem :image-src="item['image_url']" :text="item['text']"></OcrItem>
    </div>
  </main>
</template>

<style scoped>


</style>
