<script setup>
import { computed } from 'vue'

import IconRotate from '@/components/icons/IconRotate.vue'
import IconFlip from '@/components/icons/IconFlip.vue'
import IconNoise from '@/components/icons/IconNoise.vue'
import IconScailing from '@/components/icons/IconScailing.vue'
import IconBright from '@/components/icons/IconBright.vue'
import IconSaturation from '@/components/icons/IconSaturation.vue'
import IconContrast from '@/components/icons/IconContrast.vue'
import IconClose from './icons/IconClose.vue'

// Define props received from parent component
const props = defineProps({
  title: String,
  type: String,
  value: [String, Number]
})

// Computed property to dynamically select the icon component based on the title prop
const iconComponent = computed(() => {
  switch (props.title) {
    case 'Rotate':
      return IconRotate
    case 'Flip':
      return IconFlip
    case 'Noise':
      return IconNoise
    case 'Scailing':
      return IconScailing
    case 'Brightness':
      return IconBright
    case 'Saturation':
      return IconSaturation
    case 'Contrast':
      return IconContrast
    default:
      return null
  }
})

// Computed property to format the displayed value based on the title prop
const formattedValue = computed(() => {
  switch (props.title) {
    case 'Rotate':
      return `+${props.value}° / -${props.value}°`
    case 'Noise':
      return `${props.value}%`
    case 'Brightness':
    case 'Saturation':
    case 'Contrast':
      return `${props.value}x`
    case 'Flip':
      return props.value === 'Horizontal' ? 'Horizontal' : 'Vertical'
    case 'Scailing':
      return `${props.value}x`
    default:
      return props.value
  }
})

// Computed property to format the title displayed in the component
const formattedTitle = computed(() => {
  switch (props.title) {
    case 'Noise':
      return `${props.title}/${props.type}`
    default:
      return props.title
  }
})

// Define emitted event for parent component communication
const emit = defineEmits(['close'])

// Function to emit 'close' event to parent component
function closePopup() {
  emit('close', { title: props.title, type: props.type })
}
</script>


<template>
  <div id="Box" class="flex relative">
    <!-- Display the icon component dynamically based on iconComponent computed property -->
    <div class="w-1/5">
      <component :is="iconComponent" />
    </div>
    <!-- Display formatted title and value -->
    <div class="flex flex-col w-2/5 ml-5">
      <div id="text-title">{{ formattedTitle }}</div>
      <div id="text">{{ formattedValue }}</div>
    </div>
    <!-- Close button -->
    <button class="popup-close" @click="closePopup">
      <!-- Use IconClose component with specific class -->
      <IconClose class="icon-size" />
    </button>
  </div>
</template>


<style scoped>
#Box {
  position: relative;
  width: 100%;
  height: 72px;
  padding: 12px;
  border-radius: 8px;
  background: #eff1ff;
  margin-top: 10px;
}
#text-title {
  font-size: 14px;
  font-weight: 500;
}
#text {
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #7e7e7e;
}
.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.icon-size {
  width: 15px;
  height: 15px;
}
</style>
