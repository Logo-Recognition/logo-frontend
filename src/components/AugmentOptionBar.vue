<script setup>
import IconRotate from '@/assets/icons/IconRotate.vue';
import IconFlip from '@/assets/icons/IconFlip.vue';
import IconNoise from '@/assets/icons/IconNoise.vue';
import IconScailing from '@/assets/icons/IconScailing.vue';
import IconBright from '@/assets/icons/IconBright.vue';
import IconSaturation from '@/assets/icons/IconSaturation.vue';
import IconContrast from '@/assets/icons/IconContrast.vue';
import { ref } from 'vue';
import { defineEmits } from 'vue';

// Define emitted event for parent component communication
const emit = defineEmits(['data-emitted']);

// Reactive variable for the currently focused augment
const FocusingAugment = ref('Rotate'); // Initially set to 'Rotate'

// Function to update the currently focused augment
const updateFocusingAugment = (augment) => {
  FocusingAugment.value = augment; // Update the reactive variable
  sendData(); // Emit data to parent component
};

// Function to emit data to parent component
const sendData = () => {
  const data = FocusingAugment.value; // Get the current focused augment
  emit('data-emitted', data); // Emit data to parent component
};
</script>

<template>
  <div id="OptionBar" class="flex justify-around">
    <div class="flex justify-around w-3/4 items-center">
      <!-- Icon components with click events to update focused augment -->
      <IconRotate class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Rotate' }" @click="updateFocusingAugment('Rotate')" />
      <IconFlip class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Flip' }" @click="updateFocusingAugment('Flip')" />
      <IconNoise class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Noise' }" @click="updateFocusingAugment('Noise')" />
      <IconScailing class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Scailing' }" @click="updateFocusingAugment('Scailing')" />
      <IconBright class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Brightness' }" @click="updateFocusingAugment('Brightness')" />
      <IconSaturation class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Saturation' }" @click="updateFocusingAugment('Saturation')" />
      <IconContrast class="cursor-pointer button" :class="{ 'active': FocusingAugment === 'Contrast' }" @click="updateFocusingAugment('Contrast')" />
    </div>
  </div>
</template>


<style scoped>
#OptionBar {
  width: 100%;
  height: 60px;
  border-radius: 16px;
  border: 1px solid #c8cdd0;
  display: flex;
  align-items: center;
  opacity: 1;
}
#OptionBar > * {
  height: 80%; /* Ensures the icons do not exceed the height of the container */
}
.button {
  color: #7E7E7E;
}
.button.active {
  color: #7585FF;
}
</style>
