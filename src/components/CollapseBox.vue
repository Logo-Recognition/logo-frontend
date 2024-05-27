<script setup>
import { computed } from 'vue'

import IconRotate from '@/components/icons/IconRotate.vue'
import IconFlip from '@/components/icons/IconFlip.vue'
import IconNoise from '@/components/icons/IconNoise.vue'
import IconScailing from '@/components/icons/IconScailing.vue'
import IconBright from '@/components/icons/IconBright.vue'
import IconSaturation from '@/components/icons/IconSaturation.vue'
import IconContrast from '@/components/icons/IconContrast.vue'

const props = defineProps({
  title: String,
  type: String,
  value: [String, Number]
})

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

const formattedValue = computed(() => {
  switch (props.title) {
    case 'Rotate':
      return `+${props.value}°/-${props.value}°`
    case 'Noise':
      return `${props.value}%`
    case 'Brightness':
    case 'Saturation':
    case 'Contrast':
      return `${props.value}x`
    case 'Flip':
      return props.value === 'horizontal' ? 'Horizontal' : 'Vertical'
    case 'Scailing':
      return `${props.value}x`
    default:
      return props.value
  }
})
</script>

<template>
  <div id="Box" class="flex">
    <div class="w-1/5">
      <component :is="iconComponent" />
    </div>
    <div class="flex flex-col w-2/5 ml-5">
      <div id="text-title">{{ title }}</div>
      <div id="text">{{ formattedValue }}</div>
    </div>
  </div>
</template>

<style scoped>
#Box {
  width: 100%;
  height: 64px;
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
</style>
