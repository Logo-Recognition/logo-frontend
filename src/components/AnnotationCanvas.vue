<script setup>
import { ref, onMounted } from 'vue'
import { fabric } from 'fabric'
import IconCursorPointer from './icons/IconCursorPointer.vue'
import IconBoundingBox from './icons/IconBoundingBox.vue'
import IconTxtFile from './icons/IconTxtFile.vue'
import IconZoomIn from './icons/IconZoomIn.vue'
import IconZoomOut from './icons/IconZoomOut.vue'
import BoxNameModal from './LabelModal.vue'

const canvasRef = ref(null)
let canvas = null

const mouseCoordinates = ref({ x: 0, y: 0 })
let verticalLine, horizontalLine

let isDrawing = false
let startPoint = { x: 0, y: 0 }
let currentBox = null
const showModal = ref(false)

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
  const rect = new fabric.Rect({
    left: startPoint.x,
    top: startPoint.y,
    width: endPoint.x - startPoint.x,
    height: endPoint.y - startPoint.y,
    fill: 'rgba(255, 0, 0, 0.2)',
    stroke: '#f00',
    strokeWidth: 2,
    cornerSize: 10,
    cornerColor: '#f00',
    selectable: true,
    hasControls: true,
    name: ''
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  currentBox = rect
}

const onMouseDown = (event) => {
  isDrawing = true
  startPoint = canvas.getPointer(event.e)
}

const onMouseMove = (event) => {
  if (!isDrawing) return
  const currentPoint = canvas.getPointer(event.e)
  if (currentBox) {
    canvas.remove(currentBox)
  }
  drawNewBox(startPoint, currentPoint)
}

const onMouseUp = () => {
  isDrawing = false
  showModal.value = true
}

const hideModal = (cancel = false) => {
  if (cancel && currentBox) {
    canvas.remove(currentBox)
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

const handleModalSubmit = (name) => {
  if (currentBox) {
    currentBox.set('name', name)
  }
  hideModal()
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

defineExpose({ loadImage })

onMounted(() => {
  canvas = new fabric.Canvas(canvasRef.value, {
    isDrawingMode: false
  })

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
})
</script>

<template>
  <div class="fabric bg-white">
    <div class="toolbar-container">
      <button @click="onPointer"><IconCursorPointer /></button>
      <button @click="onDrawing"><IconBoundingBox /></button>
      <button @click="toTextFile"><IconTxtFile /></button>
      <button @click="onZoomIn"><IconZoomIn /></button>
      <button @click="onZoomOut"><IconZoomOut /></button>
    </div>

    <canvas ref="canvasRef" width="500" height="500" />
    <div class="mouse-coordinates">X: {{ mouseCoordinates.x }}, Y: {{ mouseCoordinates.y }}</div>

    <BoxNameModal v-if="showModal" @close="hideModal" @submit="handleModalSubmit" />
  </div>
</template>

<style scoped>
.fabric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  padding: 24px;
  border-radius: 16px;
}

.toolbar-container {
  display: flex;
  justify-content: flex-start;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
}

canvas {
  background: ghostwhite;
  border: 1px solid gainsboro;
  border-radius: 8px;
  width: 100%;
}

.mouse-coordinates {
  margin-top: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
</style>
