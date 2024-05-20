<script setup>
import IconSourceImage from '@/components/icons/IconSourceImage.vue';
import IconTrainTestSplit from '@/components/icons/IconTrainTestSplit.vue';
import { ref,onMounted } from 'vue';
import {API_URL} from '@/config.js'
import Slider from '@vueform/slider';

const range = ref([100, 100]);
const sliderGradient = ref(`linear-gradient(to right, #EDB95E ${range.value[0]}%, #CA2222 ${range.value[1]}%)`);
const train_test_value = ref([range.value[0],100 - range.value[1],range.value[1] - range.value[0]])
const images = ref([]);
const classes = ref([]);
const onDrag = (value) => {
    const startColor = '#EDB95E';
    const endColor = '#CA2222';
    const start = value[0];
    const end = value[1];
    sliderGradient.value = `linear-gradient(to right, ${startColor} ${start}%, ${endColor} ${end}%)`;
    train_test_value.value =  [value[0],value[1] - value[0],100 - value[1]]
};

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/api/dataset`);
    const responseData = await response.json();
    classes.value = responseData["total_buckets"];
    images.value = responseData["total_images"];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

</script>

<template>
  <main id="Dataset-page" class="p-10 bg-background w-full">
    <h1 class="text-lg font-medium text-black">Dataset</h1>
    <div id="source-img" class="flex flex-col bg-white rounded-3xl px-8 py-6 mt-9">
      <div class="flex flex-row justify-start items-center">
        <IconSourceImage />
        <span class="text-base font-medium text-sub-primary pl-3">Source Image</span>
      </div>
      <div class="flex flex-col justify-start mt-4">
        <span class="text-sm font-normal text-black pl-8">Image: {{ images }}</span>
        <span class="text-sm font-normal text-black pl-8">Classes: {{ classes }}</span>
      </div>
    </div>
    <div id="train-test-split" class="flex flex-col bg-white rounded-3xl px-8 py-6 mt-9">
        <div class="flex flex-row justify-start items-center mb-4">
            <IconTrainTestSplit />
            <span class="text-base font-medium text-sub-primary pl-3 ">Train/Test Split</span>
        </div>
        <div class="flex flex-row justify-between mb-6">
            <div id="train" class="flex flex-col h-24 p-4 rounded-2xl border border-warning justify-between w-full">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">TRAIN SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-warning px-4 py-1">
                        <span class="text-sm text-white font-bold">{{train_test_value[0]}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*train_test_value[0]/100) }} Images</span>
            </div>
            <div id="train" class="flex flex-col h-24 p-4 rounded-2xl border border-information justify-between w-full mx-6">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">VALID SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-information px-4 py-1">
                        <span class="text-sm text-white font-bold">{{train_test_value[1]}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*train_test_value[1]/100) }} Images</span>
            </div><div id="train" class="flex flex-col h-24 p-4 rounded-2xl border border-error justify-between w-full">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">TEST SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-error px-4 py-1">
                        <span class="text-sm text-white font-bold">{{train_test_value[2]}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*train_test_value[2]/100) }} Images</span>
            </div>
        </div>
        <Slider v-model="range" class="slider" @slide="onDrag" :tooltips="false"/>
    </div>
    <div id="action" class="flex flex-row bg-white rounded-3xl px-8 py-6 mt-6">
        <button class="rounded-lg bg-secondary font-medium text-xs text-white px-4 py-2 w-32 shadow">Create</button>
        <button class="rounded-lg border border-dark-grey font-medium text-xs text-dark-grey px-4 py-2 w-16 ml-4 shadow">Reset</button>
    </div>
  </main>a
</template>

<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
#train-test-split .slider ::v-deep(.slider-base) {
    background: v-bind(sliderGradient) ;
}
.slider{
    --slider-connect-bg: #4A90E2;
    --slider-handle-ring-color: #4A90E2;
}
</style>
