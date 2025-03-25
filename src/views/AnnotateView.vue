<script setup>
import { ref, onMounted, computed } from 'vue'
import { fabric } from 'fabric'
import { toast } from 'vue3-toastify'
import { ContentLoader } from 'vue-content-loader'
import IconCursorPointer from '@/assets/icons/IconCursorPointer.vue'
import IconBoundingBox from '@/assets/icons/IconBoundingBox.vue'
import IconTxtFile from '@/assets/icons/IconTxtFile.vue'
import IconBin from '@/assets/icons/IconBin.vue'
import IconEdit from '@/assets/icons/IconEdit.vue'
import BoxNameModal from '@/components/LabelModal.vue'
import axios from 'axios'
import Multiselect from 'vue-multiselect'

const canvasRef = ref(null)
const labelsContainerRef = ref(null)
let canvas = null

const mode = ref('pointer')
let isDragging = false
let isResizing = false
let isDrawing = false
let currentBox = null
const submittedBoxes = ref([])

let startPoint = { x: 0, y: 0 }
const mouseCoordinates = ref({ x: 0, y: 0 })
let verticalLine, horizontalLine

const showModal = ref(false)
const useDefaultClass = ref(false)
const defaultClass = ref('')
const classList = ref([])
const lastUsedClass = ref('')

const currentTab = ref('Unannotated')
const loading = ref(false)
const unannotatedImages = ref([])
const annotatedImages = ref([])

const isImageSelected = ref(false)
const selectedClasses = ref([])
const selectedImage = ref({ name: '', width: 0.0, height: 0.0 })

const fetchClassList = async () => {
  try {
    const response = await axios.get(`/api/class`)
    classList.value = response.data.classes
  } catch (error) {
    console.error('Error fetching class list:', error)
  }
}

const loadImageToCanvas = (imageSrc, imageName, labels) => {
  fabric.Image.fromURL(imageSrc, (img) => {
    canvas.clear()

    const containerWidth = canvasRef.value.offsetWidth
    const containerHeight = canvasRef.value.offsetHeight

    const scaleX = containerWidth / img.width
    const scaleY = containerHeight / img.height
    const scale = Math.min(scaleX, scaleY)

    canvas.setWidth(containerWidth)
    canvas.setHeight(containerHeight)

    img.set({
      left: 0,
      top: 0,
      scaleX: scale,
      scaleY: scale
    })
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))

    canvas.getObjects().forEach((obj) => {
      if (obj.type !== 'rect') {
        canvas.remove(obj)
      }
    })

    canvas.remove(verticalLine)
    canvas.remove(horizontalLine)

    const boxesForImage = []

    if (labels && Array.isArray(labels)) {
      labels.forEach((label) => {
        const [x1, y1, x2, y2] = label.bbox.split(' ').map(parseFloat)
        const box = drawNewBox(x1 * scale, y1 * scale, x2 * scale, y2 * scale, {
          class_name: label.class_name
        })
        box.imageName = imageName
        boxesForImage.push(box)
      })
    }

    canvas.renderAll()
    submittedBoxes.value.push(...boxesForImage)

    verticalLine.set({ x1: containerWidth / 2, x2: containerWidth / 2, y1: 0, y2: containerHeight })
    horizontalLine.set({
      x1: 0,
      x2: containerWidth,
      y1: containerHeight / 2,
      y2: containerHeight / 2
    })
    canvas.add(verticalLine, horizontalLine)
    canvas.renderAll()
    selectedImage.value.name = imageName
    selectedImage.value.width = img.width
    selectedImage.value.height = img.height
  })

  isImageSelected.value = true
}

const drawNewBox = (x1, y1, x2, y2, label = null) => {
  const left = x1
  const top = y1
  const width = x2 - x1
  const height = y2 - y1

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
    imageName: selectedImage.value.name,
    name: label ? label.class_name : '',
    classId: 0,
    x1,
    y1,
    x2,
    y2
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  currentBox = rect

  if (labelsContainerRef.value) {
    const labelElement = document.createElement('div')
    labelElement.className = 'label-item'
    labelElement.textContent = `Coordinates: (${x1}, ${y1}), (${x2}, ${y2}) - ${rect.name}`
    labelsContainerRef.value.appendChild(labelElement)
  }

  return rect
}

const toTextFile = () => {
  const objects = visibleObjects.value.filter(
    (obj) => obj.type === 'rect' && obj.imageName === selectedImage.value.name
  )

  let textContent = ''

  objects.forEach((obj) => {
    const classId = obj.classId !== undefined ? obj.classId : 0

    const imageWidth = selectedImage.value.width
    const imageHeight = selectedImage.value.height

    const centerX = (obj.left + obj.width / 2) / imageWidth
    const centerY = (obj.top + obj.height / 2) / imageHeight
    const width = obj.width / imageWidth
    const height = obj.height / imageHeight

    const yoloString = `${classId} ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`
    textContent += yoloString + '\n'
  })

  const blob = new Blob([textContent], { type: 'text/plain' })
  const blobURL = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = blobURL
  a.download = `${selectedImage.value.name.split('.')[0]}.txt`
  a.click()

  URL.revokeObjectURL(blobURL)
}

const onMouseDown = (event) => {
  if (!isImageSelected.value) {
    toast.warning('Please Select the Image', {
      autoClose: 3000
    })
    return
  }
  if (isDefaultClassInvalid.value) {
    toast.warning('Please Select the Class', {
      autoClose: 3000
    })
    return
  }

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
    const x1 = startPoint.x
    const y1 = startPoint.y
    const x2 = currentPoint.x
    const y2 = currentPoint.y
    drawNewBox(x1, y1, x2, y2)
  } else if (mode.value === 'pointer' && (isDragging || isResizing)) {
    canvas.renderAll()
  }
}

const onMouseUp = () => {
  if (mode.value === 'drawing') {
    isDrawing = false
    if (currentBox) {
      if (useDefaultClass.value && defaultClass.value) {
        currentBox.set('name', defaultClass.value)
        submittedBoxes.value.push(currentBox)
        currentBox = null
      } else {
        showModal.value = true
      }
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
    let classId
    if (classList.value.length === 0) {
      classId = 0
    } else {
      classId = classList.value.indexOf(name)
      if (classId === -1) {
        classId = 0
      }
    }

    currentBox.set('name', name)
    currentBox.set('classId', classId)

    if (!selectedClasses.value.includes(name)) {
      selectedClasses.value.push(name)
    }

    if (!submittedBoxes.value.includes(currentBox)) {
      submittedBoxes.value.push(currentBox)
    }

    submittedBoxes.value.push(currentBox)
    console.log('submittedBoxes:', submittedBoxes.value)
  }
  showModal.value = false
  currentBox = null
  lastUsedClass.value = name
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

const isDefaultClassInvalid = computed(() => {
  return useDefaultClass.value && (!defaultClass.value || defaultClass.value.trim() === '')
})

const visibleObjects = computed(() => {
  const allObjects = [...canvas.getObjects(), ...submittedBoxes.value]
  const filteredObjects = allObjects.filter(
    (obj, index, self) =>
      self.findIndex(
        (o) =>
          o &&
          o.type === 'rect' &&
          o.x1 === obj.x1 &&
          o.y1 === obj.y1 &&
          o.x2 === obj.x2 &&
          o.y2 === obj.y2 &&
          o.imageName === selectedImage.value.name
      ) === index
  )
  return filteredObjects
})

const editLabel = (obj) => {
  currentBox = obj
  showModal.value = true
}

const deleteLabel = (obj) => {
  canvas.remove(obj)
  submittedBoxes.value = submittedBoxes.value.filter((box) => {
    return !(
      box.x1 === obj.x1 &&
      box.y1 === obj.y1 &&
      box.x2 === obj.x2 &&
      box.y2 === obj.y2 &&
      box.imageName === obj.imageName
    )
  })
  submittedBoxes.value = [...submittedBoxes.value]
}

const saveAnnotations = async () => {
  try {
    const objects = canvas.getObjects()
    const containerWidth = canvasRef.value.offsetWidth
    const containerHeight = canvasRef.value.offsetHeight

    const scaleX = containerWidth / selectedImage.value.width
    const scaleY = containerHeight / selectedImage.value.height
    const scale = Math.min(scaleX, scaleY)

    const annotatedData = {
      image_name: selectedImage.value.name,
      label: []
    }

    objects.forEach((obj) => {
      if (
        obj.type === 'rect' &&
        typeof obj.x1 === 'number' &&
        typeof obj.y1 === 'number' &&
        typeof obj.x2 === 'number' &&
        typeof obj.y2 === 'number'
      ) {
        annotatedData.label.push({
          class_name: obj.name,
          bbox: `${obj.x1 / scale} ${obj.y1 / scale} ${obj.x2 / scale} ${obj.y2 / scale}`
        })
      }
    })

    console.log('annotatedData:', annotatedData)

    const response = await fetch(`/api/annotated-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(annotatedData)
    })

    if (response.ok) {
      toast.success('Annotations saved successfully!', {
        autoClose: 3000
      })
      console.log('Annotations saved successfully')
    } else {
      console.error('Error saving annotations:', response.status)
    }
  } catch (error) {
    console.error('Error saving annotations:', error)
  }
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

const switchTab = (tab) => {
  currentTab.value = tab
  fetchImages(tab)
}

const fetchImages = async (tab) => {
  loading.value = true

  try {
    const endpoint = tab.toLowerCase() === 'unannotated' ? 'images' : 'annotated-images'
    const response = await fetch(`/api/${endpoint}`)
    if (response.ok) {
      let images = []

      if (tab.toLowerCase() === 'unannotated') {
        const imageData = await response.json()
        images = imageData.map((data, index) => {
          return {
            id: `image-${index}`,
            src: data.url,
            alt: `Image ${index + 1}`,
            name: data.image_name
          }
        })
        console.log(images)
        unannotatedImages.value = images
      } else if (tab.toLowerCase() === 'annotated') {
        const imageData = await response.json()
        images = imageData.map((data, index) => {
          return {
            id: `image-${index}`,
            src: data.image,
            alt: `Image ${index + 1}`,
            name: data.image_name,
            labels: data.label
          }
        })
        annotatedImages.value = images
        console.log(annotatedImages.value)
      }
    } else {
      console.error('Error fetching images:', response.status)
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false
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
  fetchImages('Annotated')
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
              :class="{
                active: mode === 'drawing',
                disabled: !isImageSelected || isDefaultClassInvalid
              }"
              :disabled="!isImageSelected || isDefaultClassInvalid"
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
        </div>
        <canvas ref="canvasRef" class="canvas-wrapper" width="725" height="460"></canvas>
        <!-- <canvas ref="canvasRef" class="canvas-wrapper" width="830" height="530"></canvas> -->

        <div class="mouse-coordinates">
          X: {{ mouseCoordinates.x }}, Y: {{ mouseCoordinates.y }}
        </div>
      </div>
      <div class="labels-container bg-white" ref="labelsContainer">
        <h2 class="text-base text-dark font-medium mb-4">Labels</h2>
        <div class="default-labels">
          <div class="checkbox-container">
            <input
              type="checkbox"
              id="checkbox"
              v-model="useDefaultClass"
              @click="showModal = false"
            />
            <label for="checkbox" class="ml-2">Default Label</label>
          </div>
          <div class="multiselect-container">
            <Multiselect
              v-model="defaultClass"
              :options="classList"
              :searchable="true"
              :close-on-select="true"
              placeholder="Select class"
              @open="fetchClassList"
              class="dropdown-select bg-light"
            >
              <template v-slot:noOptions>No classes found</template>
            </Multiselect>
          </div>
        </div>
        <div v-if="canvas" class="labels-wrapper">
          <div v-for="obj in visibleObjects" :key="obj.id" class="label-item">
            <span>{{ obj.name }}</span>
            <div class="label-actions">
              <button @click="editLabel(obj)"><IconEdit /></button>
              <button @click="deleteLabel(obj)"><IconBin /></button>
            </div>
          </div>
        </div>
        <div class="submit-button">
          <button class="button bg-secondary text-white hover:bg-hover" @click="saveAnnotations">
            Apply
          </button>
        </div>
      </div>

      <BoxNameModal
        v-if="showModal && !useDefaultClass"
        @close="discardCurrentBox"
        @submit="handleModalSubmit"
        @classSelected="addSelectedClass"
        :selectedClasses="selectedClasses"
        :currentBox="currentBox"
        :lastUsedClass="lastUsedClass"
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
              <img v-lazy="image.src" :alt="image.alt" class="image" />
            </div>
            <div v-if="loading" class="loading-spinner">
              <ContentLoader viewBox="0 0 250 110">
                <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
                <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
                <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
                <rect x="0" y="60" rx="3" ry="3" width="250" height="10" />
                <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
                <rect x="20" y="100" rx="3" ry="3" width="80" height="10" />
              </ContentLoader>
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
              @click="loadImageToCanvas(image.src, image.name, image.labels)"
            >
              <img v-lazy="image.src" :alt="image.alt" class="image" />
            </div>
          </div>
          <div v-if="loading" class="loading-spinner">
            <ContentLoader viewBox="0 0 250 110">
              <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
              <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
              <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="250" height="10" />
              <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
              <rect x="20" y="100" rx="3" ry="3" width="80" height="10" />
            </ContentLoader>
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
  grid-template-rows: 1fr 2fr;
  grid-template-areas:
    'left top'
    'left bottom';
  gap: 0px 24px;
}

.canvas-container {
  grid-area: left;
  border-radius: 16px;
  padding: 24px;
  max-width: calc(100vw - 480px);
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.canvas-wrapper {
  width: 100%;
  background: ghostwhite;
  border: 1px solid gainsboro;
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

.mouse-coordinates {
  margin-top: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.coordinate-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.labels-container {
  grid-area: top;
  border-radius: 16px;
  padding: 16px;
  height: 35vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.default-labels {
  display: flex;
  align-items: start;
  width: 100%;
  gap: 12px;
  margin-bottom: 4px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.multiselect-container {
  flex-grow: 1;
  min-width: 150px;
}

.multiselect {
  padding: 2px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.labels-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 4px;
}

.label-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  border-bottom: 1px solid #d8dbd8;
}

.label-actions {
  display: flex;
  gap: 8px;
}

.submit-button {
  bottom: 16px;
  left: 16px;
  right: 16px;
  width: 100%;
}

.submit-button button {
  width: 100%;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.images-container {
  grid-area: bottom;
  display: flex;
  flex-direction: column;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
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
  max-height: 40vh;
  overflow-y: auto;
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
</style>
