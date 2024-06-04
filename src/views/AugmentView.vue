<script setup>
import CollapseBox from '@/components/CollapseBox.vue'
import AugmentOptionBar from '@/components/AugmentOptionBar.vue'
import FlipSelectBar from '@/components/FlipSelectBar.vue'
import NoiseSelectBar from '@/components/NoiseSelectBar.vue'
import { ref, watch, computed, onMounted } from 'vue'
import Slider from '@vueform/slider'
import { useParametersStore } from '@/stores/Augment.js'

const store = useParametersStore()

// // Accessing augmentation parameters
const augmentationParam = computed(() => store.augmentationParam)

// // Example of updating a parameter
const updateRotate = (type, value) => {
  store.updateAugmentationParam(type, value)
}

const pathImage = 'http://192.168.2.44:5000/api/annotated-images'
const images = ref([])

// for (const path in imageModules) {
//   imageModules[path]().then((mod) => {
//     images.value.push(mod.default)
//   })
// }

const fetchClasses = async () => {
  try {
    const response = await fetch(pathImage)
    const data = await response.json()

    if (response.ok) {
      // Extracting image URLs from the fetched data
      images.value = data.map((item) => item['image'])
      handleImageClick(images.value[0])
    } else {
      console.log('error to get')
    }
  } catch (err) {
    console.error(err)
  } finally {
    console.log('error to get')
  }
}

const statusnow = ref('Rotate') // current action ('Rotate', 'Flip', 'Noise')
const selectedImageSrc = ref(null)
const imageWidth = ref(900)
const imageHeight = ref(300)
const originalImage = ref(null)
const isImage = ref(false)

const selectedRotation = ref(0)
const selectedFlip = ref('none')
const selectedNoiseLevel = ref(0)
const selectedNoiseType = ref('pepper') // 'pepper' or 'chromatic'
const selectedScale = ref(1) // default scale is 1 (no scaling)
const selectedBrightness = ref(1) // default brightness is 1 (no change)
const selectedSaturation = ref(1) // default saturation is 1 (no change)
const selectedContrast = ref(1) // default contrast is 1 (no change)

// const selectedRotationAp = ref(0)
const selectedFlipAp = ref('none')
const selectedNoiseLevelAp = ref(0)
const selectedNoiseTypeAp = ref('pepper') // 'pepper' or 'chromatic'

const showCollapseBoxRotation = ref(false)
const showCollapseBoxFlip = ref(false)
const showCollapseBoxNoise = ref(false)
const showCollapseBoxScale = ref(false)
const showCollapseBoxBrightness = ref(false)
const showCollapseBoxSaturation = ref(false)
const showCollapseBoxContrast = ref(false)

const formatTooltip = (value) => {
  return value.toFixed(1)
}

const handleRotationUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedRotation.value = value
}
const handleBrightnessUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedBrightness.value = value
}
const handleSaturationUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedSaturation.value = value
}
const handleContrastUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedContrast.value = value
}
const handleScaleUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedScale.value = value
}
const handleNoiseUpdate = (value) => {
  console.log('Rotation value received from child:', value)
  selectedNoiseLevel.value = value
}
const updateFlipName = (newValue) => {
  selectedFlip.value = newValue
}
const updateNoiseName = (newValue) => {
  selectedNoiseType.value = newValue
}
const handleData = (data) => {
  console.log('Data received from child:', data)
  statusnow.value = data
}

const handleImageClick = (src) => {
  selectedImageSrc.value = src
  originalImage.value = new Image()
  originalImage.value.crossOrigin = 'Anonymous'
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
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((selectedRotation.value * Math.PI) / 180)
  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  ctx.restore
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

  if (selectedFlip.value === 'Horizontal') {
    ctx.scale(-1, 1)
  } else if (selectedFlip.value === 'Vertical') {
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

  canvas.width = imageWidth.value
  canvas.height = imageHeight.value

  if (selectedScale.value < 1) {
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
  } else {
    ctx.drawImage(img, 0, 0, imageWidth.value, imageHeight.value)
  }

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
    statusnow,
    selectedContrast
  ],
  updatePreviewImage
)

const getImageName = (path) => {
  return path.split('/').pop()
}

const Apply = () => {
  switch (statusnow.value) {
    case 'Rotate':
      if (selectedRotation.value == 0) {
        showCollapseBoxRotation.value = false
      } else {
        showCollapseBoxRotation.value = true
      }
      updateRotate('rotate', selectedRotation.value)
      break
    case 'Flip':
      if (selectedFlip.value == 'none') {
        showCollapseBoxFlip.value = false
      } else {
        showCollapseBoxFlip.value = true
      }
      selectedFlipAp.value = selectedFlip.value
      if (selectedFlipAp.value == 'none') {
        updateRotate('flip_horizontal', false)
        updateRotate('flip_verical', false)
      } else if (selectedFlipAp.value == 'Horizontal') {
        updateRotate('flip_horizontal', true)
        updateRotate('flip_verical', false)
      } else {
        updateRotate('flip_horizontal', false)
        updateRotate('flip_verical', true)
      }
      break
    case 'Noise':
      if (selectedNoiseLevel.value == 0) {
        showCollapseBoxNoise.value = false
      } else {
        showCollapseBoxNoise.value = true
      }
      selectedNoiseLevelAp.value = selectedNoiseLevel.value
      selectedNoiseTypeAp.value = selectedNoiseType.value

      if (selectedNoiseTypeAp.value == 'pepper') {
        //'pepper' or 'chromatic'
        updateRotate('pepper_noise', selectedNoiseLevel.value)
        // updateRotate('pepper_noise', 0)
      } else {
        // updateRotate('gaussian_noise', 0)
        updateRotate('gaussian_noise', selectedNoiseLevel.value)
      }

      break
    case 'Scailing':
      if (selectedScale.value == 1) {
        showCollapseBoxScale.value = false
      } else {
        showCollapseBoxScale.value = true
      }
      updateRotate('scaling', selectedScale.value)
      break
    case 'Brightness':
      if (selectedBrightness.value == 1) {
        showCollapseBoxBrightness.value = false
      } else {
        showCollapseBoxBrightness.value = true
      }
      updateRotate('brightness', selectedBrightness.value)
      break
    case 'Saturation':
      if (selectedSaturation.value == 1) {
        showCollapseBoxSaturation.value = false
      } else {
        showCollapseBoxSaturation.value = true
      }
      updateRotate('saturation', selectedSaturation.value)
      break
    case 'Contrast':
      if (selectedContrast.value == 1) {
        showCollapseBoxContrast.value = false
      } else {
        showCollapseBoxContrast.value = true
      }
      updateRotate('contrast', selectedContrast.value)
      break
    default:
      break
  }
}

function handleClose(title, type) {
  switch (title) {
    case 'Rotate':
      updateRotate('rotate', 0)
      showCollapseBoxRotation.value = false
      console.log('Rotate closed')
      break
    case 'Flip':
      selectedFlipAp.value = 'none'
      showCollapseBoxFlip.value = false
      updateRotate('flip_horizontal', false)
      updateRotate('flip_verical', false)
      console.log('Flip closed')

      break
    case 'Noise':
      if (type == 'pepper') {
        updateRotate('pepper_noise', 0)
      } else {
        updateRotate('gaussian_noise', 0)
      }
      selectedNoiseLevelAp.value = 0
      selectedNoiseTypeAp.value = 'pepper'
      showCollapseBoxNoise.value = false
      // updateRotate('gaussian_noise', 0)
      // updateRotate('pepper_noise', 0)
      console.log('Noise closed')
      break
    case 'Scailing':
      updateRotate('scaling', 1)
      showCollapseBoxScale.value = false
      console.log('Scailing closed')
      break
    case 'Brightness':
      updateRotate('brightness', 1)
      showCollapseBoxBrightness.value = false
      console.log('Brightness closed')
      break
    case 'Saturation':
      updateRotate('saturation', 1)
      showCollapseBoxSaturation.value = false
      console.log('Saturation closed')
      break
    case 'Contrast':
      updateRotate('contrast', 1)
      showCollapseBoxContrast.value = false
      console.log('Contrast closed')
      break
    default:
  }
}

onMounted(() => {
  fetchClasses()
  showCollapseBoxRotation.value = augmentationParam.value.rotate !== 0
  showCollapseBoxFlip.value =
    augmentationParam.value.flip_horizontal || augmentationParam.value.flip_verical
  showCollapseBoxNoise.value =
    augmentationParam.value.gaussian_noise !== 0 || augmentationParam.value.pepper_noise !== 0
  showCollapseBoxScale.value = augmentationParam.value.scaling !== 1
  showCollapseBoxBrightness.value = augmentationParam.value.brightness !== 1
  showCollapseBoxSaturation.value = augmentationParam.value.saturation !== 1
  showCollapseBoxContrast.value = augmentationParam.value.contrast !== 1
})
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
        <h1 class="mb-5">Collapse</h1>
        <CollapseBox
          v-if="showCollapseBoxRotation"
          title="Rotate"
          :value="augmentationParam.rotate"
          @close="handleClose"
        />
        <CollapseBox
          v-if="showCollapseBoxFlip"
          title="Flip"
          :value="selectedFlipAp"
          @close="handleClose"
        />
        <CollapseBox
          v-if="augmentationParam.pepper_noise != 0"
          title="Noise"
          :value="augmentationParam.pepper_noise"
          type="pepper"
          @close="handleClose"
        />
        <CollapseBox
          v-if="augmentationParam.gaussian_noise != 0"
          title="Noise"
          :value="augmentationParam.gaussian_noise"
          type="chromatic"
          @close="handleClose"
        />
        <CollapseBox
          v-if="showCollapseBoxScale"
          title="Scailing"
          :value="augmentationParam.scaling"
          @close="handleClose"
        />
        <CollapseBox
          v-if="showCollapseBoxBrightness"
          title="Brightness"
          :value="augmentationParam.brightness"
          @close="handleClose"
        />
        <CollapseBox
          v-if="showCollapseBoxSaturation"
          title="Saturation"
          :value="augmentationParam.saturation"
          @close="handleClose"
        />
        <CollapseBox
          v-if="showCollapseBoxContrast"
          title="Contrast"
          :value="augmentationParam.contrast"
          @close="handleClose"
        />
      </div>

      <div id="Right-Box" class="flex flex-col">
        <AugmentOptionBar @data-emitted="handleData" />
        <div v-if="statusnow === 'Rotate'" class="mr-10 ml-10">
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0°</p>
            <p class="TextColor">180°</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedRotation"
            showTooltip="drag"
            :min="0"
            :max="180"
            :tooltips="true"
            @slide="handleRotationUpdate"
          />
        </div>
        <div v-if="statusnow === 'Flip'" class="mr-10 ml-10">
          <FlipSelectBar @update:checkedName="updateFlipName" />
        </div>
        <div v-if="statusnow === 'Noise'" class="mr-10 ml-10">
          <NoiseSelectBar @update:checkedName="updateNoiseName" />
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0%</p>
            <p class="TextColor">10%</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedNoiseLevel"
            showTooltip="drag"
            :min="0"
            :max="10"
            :step="1"
            :tooltips="true"
            @slide="handleNoiseUpdate"
          />
        </div>
        <div v-if="statusnow === 'Scailing'" class="mr-10 ml-10">
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0.1</p>
            <p class="TextColor">2</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedScale"
            showTooltip="drag"
            :min="0.1"
            :max="2"
            :step="0.1"
            :tooltips="true"
            @slide="handleScaleUpdate"
            :format="formatTooltip"
          />
        </div>
        <div v-if="statusnow === 'Brightness'" class="mr-10 ml-10">
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0.5</p>
            <p class="TextColor">1.5</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedBrightness"
            showTooltip="drag"
            :min="0.5"
            :max="1.5"
            :step="0.1"
            :tooltips="true"
            @slide="handleBrightnessUpdate"
            :format="formatTooltip"
          />
        </div>
        <div v-if="statusnow === 'Saturation'" class="mr-10 ml-10">
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0.1</p>
            <p class="TextColor">2</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedSaturation"
            showTooltip="drag"
            :min="0"
            :max="2"
            :step="0.1"
            :tooltips="true"
            @slide="handleSaturationUpdate"
            :format="formatTooltip"
          />
        </div>
        <div v-if="statusnow === 'Contrast'" class="mr-10 ml-10">
          <div class="flex w-full justify-between mb-3 mt-3">
            <p class="TextColor">0.1</p>
            <p class="TextColor">2</p>
          </div>
          <Slider
            id="Slider"
            v-model="selectedContrast"
            showTooltip="drag"
            :min="0.1"
            :max="2"
            :step="0.1"
            :tooltips="true"
            @slide="handleContrastUpdate"
            :format="formatTooltip"
          />
        </div>
        <div v-if="selectedImageSrc" class="flex place-content-center mt-8">
          <img :src="selectedImageSrc" alt="Selected Image" id="AugmentedImage" />
        </div>
        <div id="apply-button" class="flex mt-5">
          <div class="w-1/2">
            <p v-if="statusnow === 'Scailing'" class="text-red-700 text-xs">
              A live preview is not available for > 1x
            </p>
          </div>
          <div class="w-1/2"></div>
          <button class="apply" @click="Apply">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
#main {
  width: 100%;
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

#Slider {
  --slider-bg: #abadab;
  --slider-connect-bg: #031739;
  --slider-height: 6px;
  --slider-radius: 6px;

  --slider-handle-bg: #fefefe;
  --slider-handle-border: 2px;
  --slider-handle-width: 15.22px;
  --slider-handle-height: 16px;
  --slider-handle-radius: 9999px;
  --slider-handle-shadow: 0.5px 0.5px 2px 1px #7e7e7e;
  --slider-handle-shadow-active: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.42);
  --slider-handle-ring-width: 2px;
  --slider-handle-ring-color: #7e7e7e;

  --slider-tooltip-bg: #031739;
  --slider-tooltip-color: #eff1ff;
  --slider-tooltip-radius: 4px;
  --slider-tooltip-min-width: 36px;
  --slider-tooltip-font-size: 14px;
  --slider-tooltip-line-height: 20px;
  --slider-tooltip-font-weight: 500;
  --slider-tooltip-py: 2px;
  --slider-tooltip-px: 6px;
  --slider-tooltip-arrow-size: 5px;
  --slider-tooltip-distance: 3px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.legend {
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 5px;
}

.checked {
  background-color: #007bff;
  border-color: #007bff;
}
.TextColor {
  font-size: 14px;
  font-weight: 500;
  color: #020c1d;
}
.apply {
  background-color: #7585ff;
  width: 72px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center; /* Horizontally center the content */
  align-items: center; /* Vertically center the content */
  color: white;
}
</style>
