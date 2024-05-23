<script setup>
import { ref, onMounted } from 'vue'
import IconBoundingBox from './icons/IconBoundingBox.vue'

const props = defineProps({
  unannotatedImages: {
    type: Array,
    required: true
  }
})

const selectedImage = ref(null)
const canvas = ref(null)

function selectImage(image) {
  selectedImage.value = image
}

onMounted(() => {
  if (selectedImage.value) {
    drawImageOnCanvas(selectedImage.value)
  }
})

function drawImageOnCanvas(image) {
  const ctx = canvas.value.getContext('2d')
  const img = new Image()
  img.src = image.src
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
  }
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
          class="image-dump"
          :class="{ 'selected-image': selectedImage && selectedImage.id === image.id }"
        />
      </div>
    </div>
    <div v-if="selectedImage" class="annotation-tools bg-white">
      <div class="toolbar-container">
        <button><IconBoundingBox /></button>
      </div>
      <div class="canvas-container">
        <!-- <canvas ref="canvas" class="image-canvas"></canvas> -->
        <img :src="selectedImage.src" :alt="selectedImage.alt" class="large-image" />
      </div>
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
  overflow-x: scroll;
}

.image-wrapper {
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.image-dump {
  border-radius: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  transition: transform 0.2s;
}

.image-dump.selected-image {
  border: 1px solid;
}

.selected-image-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.large-image {
  border-radius: 10px;
  width: 300px;
  height: 300px;
}

.annotation-tools {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 24px;
  border-radius: 16px;
}

.toolbar-container {
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.canvas-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.image-canvas {
  border-radius: 10px;
  width: 300px;
  height: 300px;
}
</style>
