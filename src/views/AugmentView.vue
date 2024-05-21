<script setup>
import CollapseBox from '@/components/CollapseBox.vue'
import AugmentOptionBar from '@/components/AugmentOptionBar.vue'
import SlidingRotatebar from '@/components/SlidingRotatebar.vue'
import FlipSelectBar from '@/components/FlipSelectBar.vue'
import { ref, watch} from 'vue'

// Dynamically import all images from the 'components/images' directory
const images = ref([])
const imageModules = import.meta.glob('@/components/images/*.jpg')

for (const path in imageModules) {
  imageModules[path]().then((mod) => {
    images.value.push(mod.default)
  })
}

const selectedRotation = ref(0)
const selectedFlip = ref('none')
const selectedImageSrc = ref(null)
const imageWidth = ref(300)
const imageHeight = ref(300)
const originalImage = ref(null)
const isImage = ref(false)

//



//

const handleImageClick = (src) => {
  selectedImageSrc.value = src
  originalImage.value = new Image()
  originalImage.value.src = src
  originalImage.value.onload = () => {
    isImage.value = true
    updatePreviewImage()
  }
}

const updatePreviewImage = () => {
  if (!originalImage.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((selectedRotation.value * Math.PI) / 180)

  if (selectedFlip.value === 'horizontal') {
    ctx.scale(-1, 1)
  } else if (selectedFlip.value === 'vertical') {
    ctx.scale(1, -1)
  }

  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  ctx.restore()

  selectedImageSrc.value = canvas.toDataURL('image/jpeg')
}

const getImageName = (path) => {
  return path.split('/').pop()
}

watch([selectedRotation, selectedFlip, imageWidth, imageHeight], updatePreviewImage)
</script>

<template>
  <div id="main" class="flex flex-col">
    <h1 id="title">Augmentation</h1>
    <div id="picture-list" class="flex">
      <div v-for="(image, index) in images" :key="index" class="picture-item">
        <img
          id="img-list-set"
          :src="image"
          :alt="getImageName(image)"
          @click="handleImageClick(image)"
        />
      </div>
    </div>
    <div id="preview-body" class="flex justify-around">
      <div id="Left-Box">
        <CollapseBox />
      </div>
      <div id="Right-Box" class="flex flex-col">
        <AugmentOptionBar />
        <SlidingRotatebar/>
        <FlipSelectBar/>
        
      </div>
    </div>
    <div v-if="selectedImageSrc">
      <img :src="selectedImageSrc" alt="Selected Image" />
    </div>
    <div v-if="isImage">
      <label>
        Rotation:
        <select v-model="selectedRotation">
          <option value="0">0°</option>
          <option value="90">90°</option>
          <option value="180">180°</option>
          <option value="270">270°</option>
        </select>
      </label>
      <label>
        Flip:
        <select v-model="selectedFlip">
          <option value="none">None</option>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
      <label>
        Width:
        <input type="number" v-model="imageWidth" />
      </label>
      <label>
        Height:
        <input type="number" v-model="imageHeight" />
      </label>
    </div>
  </div>
</template>

<style scoped>
#main {
  width: 83%;
  background-color: #f0f0f0;
  padding: 10px;
}
#title {
  font-size: 18px;
  font-weight: bold;
  margin: 30px;
}

#picture-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 30px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.picture-item {
  margin-left: 0px !important;
  margin: 10px;
}

.picture-item img {
  max-width: 100px;
  cursor: pointer;
}
#img-list-set {
  width: 100px;
  height: 100px;
  gap: 0px;
  border-radius: 10px;
  border: 1px;
  opacity: 0px;
}

#Left-Box {
  width: 20%;
  min-height: 381px;
  background-color: #fefefe !important;
  border-radius: 16px;
  padding: 20px;
  margin: 30px;
}
#Right-Box {
  width: 70%;
  background-color: #fefefe;
  min-height: 381px;
  border-radius: 16px;
  padding: 20px;
  margin: 30px;
}

</style>
