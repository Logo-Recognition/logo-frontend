<script setup>
import CollapseBox from '@/components/CollapseBox.vue'
import AugmentOptionBar from '@/components/AugmentOptionBar.vue'
import SlidingRotatebar from '@/components/SlidingRotatebar.vue'
import FlipSelectBar from '@/components/FlipSelectBar.vue'
import { ref, watch } from 'vue'
// import Slider from '@vueform/slider'
// Dynamically import all images from the 'components/images' directory
const images = ref([])
const imageModules = import.meta.glob('@/components/images/*.jpg')

for (const path in imageModules) {
  imageModules[path]().then((mod) => {
    images.value.push(mod.default)
  })
}

const statusnow = ref('Rotate') // current action ('Rotate', 'Flip', 'Noise')
const selectedRotation = ref(0)
const selectedFlip = ref('none')
const selectedNoiseLevel = ref(0)
const selectedNoiseType = ref('pepper') // 'pepper' or 'chromatic'
const selectedImageSrc = ref(null)
const imageWidth = ref(600)
const imageHeight = ref(300)
const originalImage = ref(null)
const isImage = ref(false)
const selectedScale = ref(1) // default scale is 1 (no scaling)
const selectedBrightness = ref(1) // default brightness is 1 (no change)
const selectedSaturation = ref(1) // default saturation is 1 (no change)
const selectedContrast = ref(1) // default contrast is 1 (no change)

const handleRotationUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedRotation.value = value
}
const handleData = (data) => {
  console.log('Data received from child:', data)
  statusnow.value = data
}

const handleImageClick = (src) => {
  selectedImageSrc.value = src
  originalImage.value = new Image()
  originalImage.value.src = src
  originalImage.value.onload = () => {
    isImage.value = true
    updatePreviewImage() // Load the original image initially
  }
}

const applyRotation = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((selectedRotation.value * Math.PI) / 180)
  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg')
}

const applyFlip = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)

  if (selectedFlip.value === 'horizontal') {
    ctx.scale(-1, 1)
  } else if (selectedFlip.value === 'vertical') {
    ctx.scale(1, -1)
  }

  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  ctx.restore()

  return canvas.toDataURL('image/jpeg')
}

const applyPepperNoise = (img, noiseLevel) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)

  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData
  const totalPixels = data.length / 4
  const noisePixels = totalPixels * noiseLevel

  for (let i = 0; i < noisePixels; i++) {
    const pixelIndex = Math.floor(Math.random() * totalPixels) * 4
    const color = Math.random() < 0.5 ? 0 : 255 // black or white noise
    data[pixelIndex] = color
    data[pixelIndex + 1] = color
    data[pixelIndex + 2] = color
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/jpeg')
}

const applyChromaticNoise = (img, noiseLevel) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)

  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData
  const totalPixels = data.length / 4
  const noisePixels = totalPixels * noiseLevel

  for (let i = 0; i < noisePixels; i++) {
    const pixelIndex = Math.floor(Math.random() * totalPixels) * 4
    data[pixelIndex] = Math.random() * 255 // Red channel
    data[pixelIndex + 1] = Math.random() * 255 // Green channel
    data[pixelIndex + 2] = Math.random() * 255 // Blue channel
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/jpeg')
}

const applyNoise = () => {
  if (selectedNoiseType.value === 'pepper') {
    return applyPepperNoise(originalImage.value, selectedNoiseLevel.value / 100)
  } else if (selectedNoiseType.value === 'chromatic') {
    return applyChromaticNoise(originalImage.value, selectedNoiseLevel.value / 100)
  }
}

const applyScaling = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  const scaledWidth = imageWidth.value * selectedScale.value
  const scaledHeight = imageHeight.value * selectedScale.value

  canvas.width = scaledWidth
  canvas.height = scaledHeight

  ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

  return canvas.toDataURL('image/jpeg')
}

const applyBrightness = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.filter = `brightness(${selectedBrightness.value})`
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg')
}
const applySaturation = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.filter = `saturate(${selectedSaturation.value})`
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg')
}

const applyContrast = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = originalImage.value

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  ctx.filter = `contrast(${selectedContrast.value})`
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg')
}

const updatePreviewImage = () => {
  if (!originalImage.value) return

  let previewSrc = null

  switch (statusnow.value) {
    case 'Rotate':
      previewSrc = applyRotation()
      break
    case 'Flip':
      previewSrc = applyFlip()
      break
    case 'Noise':
      previewSrc = applyNoise()
      break
    case 'Scailing':
      previewSrc = applyScaling()
      break
    case 'Brightness':
      previewSrc = applyBrightness()
      break
    case 'Saturation':
      previewSrc = applySaturation()
      break
    case 'Contrast':
      previewSrc = applyContrast()
      break
    default:
      previewSrc = originalImage.value.src
  }

  selectedImageSrc.value = previewSrc
}

watch(
  [
    selectedRotation,
    selectedFlip,
    selectedNoiseLevel,
    selectedNoiseType,
    selectedScale,
    selectedBrightness,
    selectedSaturation,
    statusnow
  ],
  updatePreviewImage
)

// const applyPepperNoise = (img, noiseLevel) => {
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')

//   canvas.width = img.width
//   canvas.height = img.height

//   ctx.drawImage(img, 0, 0)
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//   const { data } = imageData
//   const totalPixels = data.length / 4
//   const noisePixels = totalPixels * noiseLevel

//   for (let i = 0; i < noisePixels; i++) {
//     const pixelIndex = Math.floor(Math.random() * totalPixels) * 4
//     const color = Math.random() < 0.5 ? 0 : 255 // black or white noise
//     data[pixelIndex] = color
//     data[pixelIndex + 1] = color
//     data[pixelIndex + 2] = color
//   }

//   ctx.putImageData(imageData, 0, 0)
//   return canvas.toDataURL('image/jpeg')
// }
// const applyChromaticNoise = (img, noiseLevel) => {
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')

//   canvas.width = img.width
//   canvas.height = img.height

//   ctx.drawImage(img, 0, 0)
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//   const { data } = imageData
//   const totalPixels = data.length / 4
//   const noisePixels = totalPixels * noiseLevel

//   for (let i = 0; i < noisePixels; i++) {
//     const pixelIndex = Math.floor(Math.random() * totalPixels) * 4
//     data[pixelIndex] = Math.random() * 255 // Red channel
//     data[pixelIndex + 1] = Math.random() * 255 // Green channel
//     data[pixelIndex + 2] = Math.random() * 255 // Blue channel
//   }

//   ctx.putImageData(imageData, 0, 0)
//   return canvas.toDataURL('image/jpeg')
// }
// const updatePreviewImage = () => {
//   if (!originalImage.value) return

//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')
//   const img = originalImage.value

//   canvas.width = imageWidth.value
//   canvas.height = imageHeight.value

//   ctx.save()
//   ctx.translate(canvas.width / 2, canvas.height / 2)
//   ctx.rotate((selectedRotation.value * Math.PI) / 180)

//   if (selectedFlip.value === 'horizontal') {
//     ctx.scale(-1, 1)
//   } else if (selectedFlip.value === 'vertical') {
//     ctx.scale(1, -1)
//   }

//   ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
//   ctx.restore()

//   let previewSrc = canvas.toDataURL('image/jpeg')

//   if (statusnow.value === 'Noise') {
//     if (selectedNoiseType.value === 'pepper') {
//       previewSrc = applyPepperNoise(originalImage.value, selectedNoiseLevel.value / 100)
//     } else if (selectedNoiseType.value === 'chromatic') {
//       previewSrc = applyChromaticNoise(originalImage.value, selectedNoiseLevel.value / 100)
//     }
//   }

//   selectedImageSrc.value = previewSrc
// }

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
        <AugmentOptionBar @data-emitted="handleData" />
        <div v-if="statusnow === 'Rotate'">
          <!-- <Slider v-model="selectedRotation" /> -->
          <SlidingRotatebar
            :initial-rotation="selectedRotation"
            @update:selected-rotation="handleRotationUpdate"
          />
          <!-- <div v-if="selectedImageSrc" class="flex place-content-center">
            <img :src="selectedImageSrc" alt="Selected Image" id="AugmentedImage" />
          </div> -->
          <!-- <FlipSelectBar /> -->
        </div>
        <div v-if="statusnow === 'Flip'">
          <FlipSelectBar />
        </div>
        <div v-if="statusnow === 'Noise'">
          <label for="noiseType">Noise Type:</label>
          <select id="noiseType" v-model="selectedNoiseType" @change="updatePreviewImage">
            <option value="pepper">Pepper Noise</option>
            <option value="chromatic">Chromatic Noise</option>
          </select>

          <label for="noiseLevel">Noise Level: {{ selectedNoiseLevel }}%</label>
          <input
            type="range"
            id="noiseLevel"
            min="0"
            max="10"
            v-model="selectedNoiseLevel"
            @input="updatePreviewImage"
          />
        </div>
        <div v-if="statusnow === 'Scailing'">
          <label for="scale">Scale: {{ selectedScale }}</label>
          <input
            type="range"
            id="scale"
            min="0.1"
            max="2"
            step="0.1"
            v-model="selectedScale"
            @input="updatePreviewImage"
          />
        </div>
        <div v-if="statusnow === 'Brightness'">
          <label for="brightness">Brightness: {{ selectedBrightness }}</label>
          <input
            type="range"
            id="brightness"
            min="0"
            max="2"
            step="0.1"
            v-model="selectedBrightness"
            @input="updatePreviewImage"
          />
        </div>
        <div v-if="statusnow === 'Saturation'">
          <label for="saturation">Saturation: {{ selectedSaturation }}</label>
          <input
            type="range"
            id="saturation"
            min="0"
            max="2"
            step="0.1"
            v-model="selectedSaturation"
            @input="updatePreviewImage"
          />
        </div>
        <div v-if="statusnow === 'Contrast'">
          <label for="contrast">Contrast: {{ selectedContrast }}</label>
          <input
            type="range"
            id="contrast"
            min="0.1"
            max="2"
            step="0.1"
            v-model="selectedContrast"
            @input="updatePreviewImage"
          />
        </div>

        <div v-if="selectedImageSrc" class="flex place-content-center">
          <img :src="selectedImageSrc" alt="Selected Image" id="AugmentedImage" />
        </div>
      </div>
    </div>
    <!-- <div v-if="selectedImageSrc">
      <img :src="selectedImageSrc" alt="Selected Image" />
    </div> -->
    <!-- <div v-if="isImage">
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
    </div> -->
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
#AugmentedImage {
  border-radius: 16px;
}
</style>
