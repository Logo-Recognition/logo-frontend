<script setup>
import { ref, computed, watch } from 'vue'
import { defineEmits } from 'vue'

const props = defineProps({
  initialRotation: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:selected-rotation'])
const selectedRotation = ref(props.initialRotation)
const isDragging = ref(false)

const selectedRotationPercentage = computed(() => {
  return (selectedRotation.value / 180) * 100
})

const showValue = () => {
  isDragging.value = true
}

const hideValue = () => {
  isDragging.value = !true
}
const UpdateRotationvalue = () => {
  emit('update:selected-rotation', selectedRotation.value)
}

watch([selectedRotation], UpdateRotationvalue)
</script>

<template>
  <div class="flex w-full justify-between">
    <p>0°</p>

    <p>180°</p>
  </div>
  <div class="slider-container" @mousedown="showValue" @mouseup="hideValue" @mouseleave="hideValue">
    <div
      class="slider-value"
      :style="{ left: `${selectedRotationPercentage}%` }"
      v-show="isDragging"
    >
      {{ selectedRotation }}
    </div>
    <input type="range" id="rotationSlider" v-model="selectedRotation" min="0" max="180" step="1" />
  </div>
</template>

<style scope>
#rotationSlider {
  width: 100%;
}
.slider-container {
  position: relative;
  width: 100%; /* ปรับความกว้างตามตัวเลื่อนของคุณ */
}

.slider-value {
  position: absolute;
  top: -30px; /* ปรับตำแหน่งเพื่อแสดงค่าตัวเลื่อนด้านบน */
  transform: translateX(-30%);
  background-color: #fff;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  text-align: center;
}

.slider-value.show {
  display: block; /* แสดงค่าตอนที่มีคลาส .show */
}

</style>
