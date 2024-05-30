<template>
  <div>
    <input type="range" min="0" max="360" v-model.number="rotationAngle" @input="updateRotationAngle">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const canvas = ref(null)
const rotationAngle = ref(0)
const imageUrl = 'http://192.168.2.44:9005/unannotated/MEA34.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20240530%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240530T085719Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c8d544155adfcb9a83126d04b19443df517127ef6f77241b63780bc69958fa3d'
let img = null

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  img = new Image()
  img.src = imageUrl
  img.onload = () => drawRotatedImage(ctx, img, rotationAngle.value)
})

watch(rotationAngle, (newAngle) => {
  const ctx = canvas.value.getContext('2d')
  drawRotatedImage(ctx, img, newAngle)
})

const updateRotationAngle = (event) => {
  rotationAngle.value = event.target.value * (Math.PI / 180)
}

const drawRotatedImage = (ctx, img, angle) => {
  const canvas = ctx.canvas
  const width = canvas.width = img.width
  const height = canvas.height = img.height

  // ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(angle)
  ctx.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.restore()
}
</script>