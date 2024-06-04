<script setup>
import IconRotate from '@/components/icons/IconRotate.vue';
import IconFlip from '@/components/icons/IconFlip.vue';
import IconNoise from '@/components/icons/IconNoise.vue';
import IconScailing from '@/components/icons/IconScailing.vue';
import IconBright from '@/components/icons/IconBright.vue';
import IconSaturation from '@/components/icons/IconSaturation.vue';
import IconContrast from '@/components/icons/IconContrast.vue';
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['data-emitted']);
const FocusingAugment = ref('Rotate');

const updateFocusingAugment = (augment) => {
  FocusingAugment.value = augment;
  sendData();
};

const sendData = () => {
  const data = FocusingAugment.value; // Replace with actual data you want to pass
  emit('data-emitted', data);
};
</script>

<template>
  <div id="OptionBar" class="flex justify-around">
    <div class="flex justify-around w-3/4 items-center">
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
