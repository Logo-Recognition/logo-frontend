<script setup>
import IconRotate from '@/components/icons/IconRotate.vue'
import IconFlip from '@/components/icons/IconFlip.vue'
import IconNoise from '@/components/icons/IconNoise.vue'
import IconScailing from '@/components/icons/IconScailing.vue'
import IconBright from '@/components/icons/IconBright.vue'
import IconSaturation from '@/components/icons/IconSaturation.vue'
import IconContrast from '@/components/icons/IconContrast.vue'
import { ref } from 'vue'

const FocusingAugment = ref('Rotate')

const updateFocusingAugment = (augment) => {
  FocusingAugment.value = augment
}
</script>

<template>
  <div id="OptionBar" class="flex justify-around">
    <div class="flex justify-around w-3/4 items-center">
      <IconRotate class="cursor-pointer" id="icon" @click="updateFocusingAugment('Rotate')" />
      <IconFlip class="cursor-pointer" @click="updateFocusingAugment('Flip')" />
      <IconNoise class="cursor-pointer" @click="updateFocusingAugment('Noise')" />
      <IconScailing class="cursor-pointer" @click="updateFocusingAugment('Scailing')" />
      <IconBright class="cursor-pointer" @click="updateFocusingAugment('Bright')" />
      <IconSaturation class="cursor-pointer" @click="updateFocusingAugment('Saturation')" />
      <IconContrast class="cursor-pointer" @click="updateFocusingAugment('Contrast')" />
    </div>
  </div>
</template>

<style scoped>
#OptionBar {
  width: 100%;
  height: 60px;
  border-radius: 16px;
  opacity: 0px;
  border: 1px solid #c8cdd0;
  display: flex;
  align-items: center; /* Vertically center the content */
}
#OptionBar > * {
  height: 80%; /* Ensures the icons do not exceed the height of the container */
}
</style>
