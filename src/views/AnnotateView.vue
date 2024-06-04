<script setup>
import { ref, onMounted } from 'vue'
import { fabric } from 'fabric'
import IconCursorPointer from '@/components/icons/IconCursorPointer.vue'
import IconBoundingBox from '@/components/icons/IconBoundingBox.vue'
import IconTxtFile from '@/components/icons/IconTxtFile.vue'
import IconZoomIn from '@/components/icons/IconZoomIn.vue'
import IconZoomOut from '@/components/icons/IconZoomOut.vue'
import BoxNameModal from '@/components/LabelModal.vue'
import { API_URL } from '@/config.js'

const canvasRef = ref(null)
let canvas = null

const mode = ref('pointer')
let isDragging = false
let isResizing = false

const mouseCoordinates = ref({ x: 0, y: 0 })
let verticalLine, horizontalLine

let isDrawing = false
let startPoint = { x: 0, y: 0 }
let currentBox = null
const submittedBoxes = ref([])

const showModal = ref(false)

const currentTab = ref('Unannotated')
const unannotatedImages = ref([])
const annotatedImages = ref([])
const selectedClasses = ref([])
const selectedImageName = ref('')

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

      const yoloString = `${classId} ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)} ${obj.name || ''}`
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

const drawNewBox = (startPoint, endPoint) => {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  const left = startPoint.x
  const top = startPoint.y
  const width = endPoint.x - startPoint.x
  const height = endPoint.y - startPoint.y

  const classId = 0
  const centerX = (left + width / 2) / canvasWidth
  const centerY = (top + height / 2) / canvasHeight
  const normalizedWidth = width / canvasWidth
  const normalizedHeight = height / canvasHeight

  const rect = new fabric.Rect({
    left,
    top,
    width,
    height,
    fill: 'rgba(255, 0, 0, 0.2)',
    stroke: '#f00',
    strokeWidth: 2,
    cornerSize: 10,
    cornerColor: '#f00',
    selectable: true,
    hasControls: true,
    name: '',
    classId,
    centerX,
    centerY,
    normalizedWidth,
    normalizedHeight
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  currentBox = rect
}

const onMouseDown = (event) => {
  if (mode.value === 'drawing') {
    isDrawing = true
    startPoint = canvas.getPointer(event.e)
    if (currentBox) {
      canvas.remove(currentBox)
    }
  } else if (mode.value === 'pointer') {
    const target = canvas.findTarget(event.e)
    if (target) {
      canvas.setActiveObject(target)
      const objectTransformHandlers = target.getTransformHandles()
      const handlePointer =
        event.e.offsetX &&
        event.e.offsetY &&
        objectTransformHandlers &&
        objectTransformHandlers.findIndex((objectTransformHandler) =>
          objectTransformHandler.containsPoint(new fabric.Point(event.e.offsetX, event.e.offsetY))
        ) > -1

      isDragging = !handlePointer
      isResizing = handlePointer

      canvas.renderAll()
    }
  }
}

const onMouseMove = (event) => {
  if (mode.value === 'drawing' && isDrawing) {
    const currentPoint = canvas.getPointer(event.e)
    if (currentBox) {
      canvas.remove(currentBox)
    }
    drawNewBox(startPoint, currentPoint)
  } else if (mode.value === 'pointer' && (isDragging || isResizing)) {
    canvas.renderAll()
  }
}

const onMouseUp = () => {
  if (mode.value === 'drawing') {
    isDrawing = false
    if (currentBox) {
      showModal.value = true
    } else {
      console.error('No currentBox set')
    }
  } else if (mode.value === 'pointer') {
    isDragging = false
    isResizing = false
  }
}

const addSelectedClass = (className) => {
  if (!selectedClasses.value.includes(className)) {
    selectedClasses.value.push(className)
    console.log('Selected Classes:', selectedClasses.value)
  } else {
    console.log(`${className} has already been selected.`)
    console.log('Selected Classes:', selectedClasses.value)
  }
}

const discardCurrentBox = () => {
  if (currentBox) {
    canvas.remove(currentBox)
    currentBox = null
  }
  showModal.value = false
}

const handleModalSubmit = (name) => {
  if (currentBox) {
    currentBox.set('name', name)

    if (!selectedClasses.value.includes(name)) {
      selectedClasses.value.push(name)
    }

    submittedBoxes.value.push(currentBox)
  }
  showModal.value = false
  currentBox = null
}

const showCoordinates = (event) => {
  const pointer = canvas.getPointer(event.e)
  mouseCoordinates.value = {
    x: Math.round(pointer.x),
    y: Math.round(pointer.y)
  }

  verticalLine.set({ x1: pointer.x, x2: pointer.x })
  horizontalLine.set({ y1: pointer.y, y2: pointer.y })
  canvas.renderAll()
}

const loadImage = (imageSrc) => {
  fabric.Image.fromURL(imageSrc, (img) => {
    canvas.clear()
    img.set({
      left: 0,
      top: 0,
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height
    })
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
  })
}

const getTabClass = (tab) => {
  const isActive = currentTab.value === tab
  return [
    'my-2 block px-7 pb-3.5 pt-4 text-s font-medium leading-tight',
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-grey-text border-b-2 border-grey-border hover:border-dark hover:text-dark hover:border-dark'
  ].join(' ')
}

const fetchImages = async (tab) => {
  try {
    const endpoint = tab.toLowerCase() === 'unannotated' ? 'images' : 'annotated-images'
    const response = await fetch(`${API_URL}/api/${endpoint}`)
    if (response.ok) {
      const imageUrls = await response.json()
      const images = imageUrls.map((url, index) => {
        const imageName = url.split('/').pop().split('?')[0]
        return {
          id: `image-${index}`,
          src: url,
          alt: `Image ${index + 1}`,
          name: imageName
        }
      })
      if (tab.toLowerCase() === 'unannotated') {
        unannotatedImages.value = images
      } else if (tab.toLowerCase() === 'annotated') {
        annotatedImages.value = images
      }
    } else {
      console.error('Error fetching images')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
const switchTab = (tab) => {
  currentTab.value = tab
  fetchImages(tab)
}

const loadImageToCanvas = (imageSrc, imageName) => {
  loadImage(imageSrc)
  selectedImageName.value = imageName
}

const saveAnnotations = async () => {
  try {
    const objects = canvas.getObjects()
    const annotatedData = {
      image_name: selectedImageName.value,
      label: []
    }

    objects.forEach((obj) => {
      if (obj.type === 'rect') {
        annotatedData.label.push({
          class_name: obj.name,
          bbox: `${obj.centerX.toFixed(6)} ${obj.centerY.toFixed(6)} ${obj.normalizedWidth.toFixed(6)} ${obj.normalizedHeight.toFixed(6)}`
        })
      }
    })

    console.log(annotatedData)
    const response = await fetch(`${API_URL}/api/annotated-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(annotatedData)
    })

    if (response.ok) {
      console.log('Annotations saved successfully')
    } else {
      console.error('Error saving annotations:', response.status)
    }
  } catch (error) {
    console.error('Error saving annotations:', error)
  }
}

onMounted(() => {
  canvas = new fabric.Canvas(canvasRef.value, {
    isDrawingMode: false
  })

  submittedBoxes.value.forEach((box) => canvas.add(box))

  verticalLine = new fabric.Line([0, 0, 0, canvas.getHeight()], {
    stroke: 'red',
    selectable: false,
    evented: false
  })

  horizontalLine = new fabric.Line([0, 0, canvas.getWidth(), 0], {
    stroke: 'red',
    selectable: false,
    evented: false
  })

  canvas.add(verticalLine, horizontalLine)
  canvas.on('mouse:down', onMouseDown)
  canvas.on('mouse:move', onMouseMove)
  canvas.on('mouse:up', onMouseUp)
  canvas.on('mouse:move', showCoordinates)

  fetchImages('Unannotated')
})
</script>

<template>
  <div class="annotate-container">
    <h1 class="page-title text-lg text-dark font-bold flex items-center justify-between">
      Annotate
    </h1>
    <div class="annotation-section">
      <div class="canvas-container bg-white">
        <div class="toolbar-container">
          <div class="tooltip">
            <button
              class="action-button pointer"
              :class="{ active: mode === 'pointer' }"
              @click="mode = 'pointer'"
            >
              <IconCursorPointer />
            </button>
            <span class="tooltip-text">Pointer</span>
          </div>
          <div class="tooltip">
            <button
              class="action-button drawing"
              :class="{ active: mode === 'drawing' }"
              @click="mode = 'drawing'"
            >
              <IconBoundingBox />
            </button>
            <span class="tooltip-text">Drawing</span>
          </div>
          <div class="tooltip">
            <button class="action-button yolo-format" @click="toTextFile">
              <IconTxtFile />
            </button>
            <span class="tooltip-text">Save YOLO format</span>
          </div>
          <div class="tooltip">
            <button class="action-button zoom-in" @click="onZoomIn">
              <IconZoomIn />
            </button>
            <span class="tooltip-text">Zoom In</span>
          </div>
          <div class="tooltip">
            <button class="action-button zoom-out" @click="onZoomOut">
              <IconZoomOut />
            </button>
            <span class="tooltip-text">Zoom Out</span>
          </div>
        </div>
        <canvas ref="canvasRef" class="canvas-wrapper" width="500" height="500"></canvas>
        <div class="xxxx">
          <div class="mouse-coordinates">
            X: {{ mouseCoordinates.x }}, Y: {{ mouseCoordinates.y }}
          </div>
        </div>
      </div>
      <div class="labels-container bg-white">
        <h2>Labels</h2>
        <div v-for="selectedClass in selectedClasses" :key="selectedClass" class="label-item">
          Selected Class: {{ selectedClass }}
        </div>
        <div v-if="canvas">
          <div v-for="obj in canvas.getObjects()" :key="obj.id" class="label-item">
            <span v-if="obj.type === 'rect'">
              YOLO Format: {{ obj.classId }} {{ obj.centerX.toFixed(6) }}
              {{ obj.centerY.toFixed(6) }} {{ obj.normalizedWidth.toFixed(6) }}
              {{ obj.normalizedHeight.toFixed(6) }} {{ obj.name || '' }}
            </span>
          </div>
        </div>
        <div class="submit-button bg-secondary text-white">
          <button class="button is-primary" @click="saveAnnotations">Save</button>
        </div>
      </div>

      <BoxNameModal
        v-if="showModal"
        @close="discardCurrentBox"
        @submit="handleModalSubmit"
        @classSelected="addSelectedClass"
        :selectedClasses="selectedClasses"
        :currentBox="currentBox"
      />

      <div class="images-container">
        <ul class="mb-5 text-sm flex list-none flex-row flex-wrap border-b-0 ps-0" role="tablist">
          <li role="presentation">
            <a
              :class="getTabClass('Unannotated')"
              @click="switchTab('Unannotated')"
              role="tab"
              aria-controls="tabs-unannotated"
              aria-selected="currentTab === 'Unannotated'"
            >
              Unannotated
              <span
                class="badge"
                :class="{
                  'bg-primary text-light': currentTab === 'Unannotated',
                  'outline-badge border-grey-text': currentTab !== 'Unannotated'
                }"
              >
                {{ unannotatedImages.length }}
              </span>
            </a>
          </li>
          <li role="presentation">
            <a
              :class="getTabClass('Annotated')"
              @click="switchTab('Annotated')"
              role="tab"
              aria-controls="tabs-annotated"
              aria-selected="currentTab === 'Annotated'"
            >
              Annotated
              <span
                class="badge"
                :class="{
                  'bg-primary text-light': currentTab === 'Annotated',
                  'outline-badge border-grey-text': currentTab !== 'Annotated'
                }"
              >
                {{ annotatedImages.length }}
              </span>
            </a>
          </li>
        </ul>
        <div
          v-if="currentTab === 'Unannotated'"
          class="tab-content"
          id="tabs-unannotated"
          role="tabpanel"
        >
          <div class="image-grid">
            <div
              v-for="image in unannotatedImages"
              :key="image.id"
              class="image-item"
              @click="loadImageToCanvas(image.src, image.name)"
            >
              <img :src="image.src" :alt="image.alt" class="image" />
            </div>
          </div>
        </div>
        <div
          v-else-if="currentTab === 'Annotated'"
          class="tab-content"
          id="tabs-annotated"
          role="tabpanel"
        >
          <div class="image-grid">
            <div
              v-for="image in annotatedImages"
              :key="image.id"
              class="image-item"
              @click="loadImageToCanvas(image.src, image.name)"
            >
              <img :src="image.src" :alt="image.alt" class="image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotate-container {
  padding: 32px 60px 40px 40px;
}

.page-title {
  margin-bottom: 16px;
}

.annotation-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 32px 24px;
}

.toolbar-container {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 5px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 16px;
}

.action-button {
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #ccc;
}

.action-button.active {
  color: #333;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: #2d3748;
  color: #fff;
  text-align: center;
  border-radius: 0.25rem;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.canvas-container {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  border-radius: 16px;
  padding: 24px;
}

.canvas-wrapper {
  background: ghostwhite;
  border: 1px solid gainsboro;
  width: 100%;
}

.submit-button {
  text-align: center;
  border-radius: 8px;
  padding: 8px 16px;
  min-width: 72px;
}

.labels-container {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  border-radius: 16px;
  padding: 16px;
  overflow-y: auto;
}

.label-item {
  padding: 4px;
  border-bottom: 1px solid #d8dbd8;
}

.images-container {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  max-height: 60%;
  overflow-y: auto;
}

.image-item {
  margin-right: 16px;
  margin-bottom: 16px;
  height: 100px;
  width: calc(50% - 16px);
  max-width: none;
  cursor: pointer;
}

.image {
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
  width: 100%;
  height: 100%;
}

.image:hover {
  transform: scale(1.05);
}

.tab-content {
  transition: opacity 0.3s ease-in-out;
  display: flex;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 100%;
  font-size: 12px;
  margin-left: 8px;
}

.outline-badge {
  border: 1px solid;
}

.mouse-coordinates {
  margin-top: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.xxxx {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
