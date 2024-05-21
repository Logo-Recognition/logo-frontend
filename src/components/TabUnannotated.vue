<script setup>
import { ref } from 'vue'

const props = defineProps({
  unannotatedImages: {
    type: Array,
    required: true
  }
})

const selectedImage = ref(null)

function selectImage(image) {
  selectedImage.value = image
}
</script>

<template>
  <div class="unannotated-container">
    <div class="image-container" :class="{ 'single-row': selectedImage }">
      <div
        v-for="image in unannotatedImages"
        :key="image.id"
        class="image-wrapper"
        @click="selectImage(image)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="dummy-image"
          :class="{ 'selected-image': selectedImage && selectedImage.id === image.id }"
        />
      </div>
    </div>
    <div v-if="selectedImage" class="selected-image-container">
      <img :src="selectedImage.src" :alt="selectedImage.alt" class="large-image" />
    </div>
  </div>
</template>

<style scoped>
.unannotated-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  flex: 1;
}

.image-container.single-row {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.image-wrapper {
  margin-right: 8px;
  cursor: pointer;
}

.dummy-image {
  border-radius: 16px;
  width: 100px;
  height: 100px;
  transition: transform 0.2s;
}

.dummy-image.selected-image {
  transform: scale(1.1);
  border: 2px solid #000;
}

.selected-image-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.large-image {
  border-radius: 16px;
  width: 300px;
  height: 300px;
}
</style>
