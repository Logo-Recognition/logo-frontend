<script setup>
import { ref, onMounted, watch, nextTick, defineProps } from 'vue'
import IconBoundingBox from './icons/IconBoundingBox.vue'
import { fabric } from 'fabric'

const { unannotatedImages } = defineProps({
  unannotatedImages: {
    type: Array,
    required: true
  }
})

const selectedImage = ref(null)
const canvasRef = ref(null)
let canvas = null
const mouseCoordinates = ref({ x: 0, y: 0 })
const isDrawing = ref(false)
let x = 0
let y = 0
let line = null

const toTextFile = async () => {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  const objects = canvas.getObjects()

  let textContent = ''

  objects.forEach((obj) => {
    if (obj.type === 'rect') {
      const classId = 0
      const centerX = (obj.left + obj.width / 2) / canvasWidth
      const centerY = (obj.top + obj.height / 2) / canvasHeight
      const width = obj.width / canvasWidth
      const height = obj.height / canvasHeight

      const yoloString = `${classId} ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
      textContent += yoloString + '\n'
    }
  })

  const blob = new Blob([textContent], { type: 'text/plain' })
  const blobURL = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = blobURL
  a.download = 'annotations.txt'
  a.click()

  URL.revokeObjectURL(blobURL)
}

const addNewBox = () => {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const left = canvasWidth / 2 - 25
  const top = canvasHeight / 2 - 25

  const rect = new fabric.Rect({
    top,
    left,
    width: 50,
    height: 50,
    fill: 'rgba(255, 86, 86, 0.5)',
    stroke: '#3845ff',
    strokeWidth: 2,
    cornerSize: 15,
    cornerStyle: 'circle',
    transparentCorners: false
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
}

const onObjectScaled = () => {
  const obj = canvas.getActiveObject()
  const width = obj.width
  const height = obj.height
  const scaleX = obj.scaleX
  const scaleY = obj.scaleY
  obj.set({
    width: width * scaleX,
    height: height * scaleY,
    scaleX: 1,
    scaleY: 1
  })
  canvas.renderAll()
}

const showCoordinates = (event) => {
  const pointer = canvas.getPointer(event.e)
  mouseCoordinates.value = {
    x: Math.round(pointer.x),
    y: Math.round(pointer.y)
  }
}

const beginDrawing = (event) => {
  const pointer = canvas.getPointer(event.e)
  x = pointer.x
  y = pointer.y
  isDrawing.value = true
  line = new fabric.Line([x, y, x, y], {
    stroke: 'black',
    strokeWidth: 2
  })
  canvas.add(line)
}

const keepDrawing = (event) => {
  if (!isDrawing.value) return
  const pointer = canvas.getPointer(event.e)
  line.set({ x2: pointer.x, y2: pointer.y })
  canvas.renderAll()
}

const stopDrawing = (event) => {
  if (!isDrawing.value) return
  const pointer = canvas.getPointer(event.e)
  line.set({ x2: pointer.x, y2: pointer.y })
  isDrawing.value = false
  canvas.renderAll()
}

function selectImage(image) {
  selectedImage.value = image
}

async function drawImageOnCanvas(image) {
  await nextTick()
  const ctx = canvasRef.value.getContext('2d')
  const img = new Image()
  img.src = image.src
  img.onload = () => {
    const canvasWidth = canvasRef.value.width
    const canvasHeight = canvasRef.value.height
    const imageAspectRatio = img.width / img.height
    const canvasAspectRatio = canvasWidth / canvasHeight

    let drawWidth, drawHeight, offsetX, offsetY

    if (imageAspectRatio > canvasAspectRatio) {
      drawWidth = canvasWidth
      drawHeight = canvasWidth / imageAspectRatio
      offsetX = 0
      offsetY = (canvasHeight - drawHeight) / 2
    } else {
      drawWidth = canvasHeight * imageAspectRatio
      drawHeight = canvasHeight
      offsetX = (canvasWidth - drawWidth) / 2
      offsetY = 0
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }
}

onMounted(() => {
  nextTick(() => {
    canvas = new fabric.Canvas(canvasRef.value)
    canvas.on('object:scaling', onObjectScaled)
    canvas.on('mouse:move', (event) => {
      if (selectedImage.value) {
        showCoordinates(event)
        keepDrawing(event)
      }
    })
    canvas.on('mouse:down', (event) => {
      if (selectedImage.value) {
        beginDrawing(event)
      }
    })
    canvas.on('mouse:up', (event) => {
      if (selectedImage.value) {
        stopDrawing(event)
      }
    })
  })
})

watch(selectedImage, async (newImage) => {
  if (newImage) {
    await drawImageOnCanvas(newImage)
  }
})
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
        <button @click="addNewBox">
          <IconBoundingBox />
        </button>
        <button @click="toTextFile">YOLO</button>
      </div>
      <div class="canvas-labels-container">
        <div class="canvas-container">
          <canvas ref="canvasRef" class="image-canvas" width="500" height="300"></canvas>
        </div>
        <div class="labels-container">
          <div v-for="object in canvas?.getObjects()" :key="object.id" class="label-item">
            Label for object
          </div>
        </div>
      </div>
      <div class="mouse-coordinates">X: {{ mouseCoordinates.x }}, Y: {{ mouseCoordinates.y }}</div>
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

.canvas-labels-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 16px;
}

.canvas-container {
  display: flex;
  justify-content: center;
  border: 1px solid #d8dbd8;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  height: 300px;
  overflow-y: auto;
}

.image-canvas {
  /* border: 1px solid #d8dbd8; */
  object-fit: contain;
}

.labels-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 16px;
  border: 1px solid #d8dbd8;
  border-radius: 8px;
  padding: 8px;
  width: 30%;
  height: 300px;
  overflow-y: auto;
}

.label-item {
  padding: 4px;
  border-bottom: 1px solid #d8dbd8;
}

.mouse-coordinates {
  margin-top: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
</style>