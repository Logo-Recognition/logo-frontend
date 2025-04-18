<script setup>
import IconSourceImage from '@/assets/icons/IconSourceImage.vue';
import IconTrainTestSplit from '@/assets/icons/IconTrainTestSplit.vue';
import IconAugment from '@/assets/icons/IconAugment.vue';
import { ref,onMounted,watch } from 'vue';
import Slider from '@vueform/slider';
import Toggle from '@vueform/toggle';
import { useParametersStore } from '@/stores/Augment.js'
import { toast } from 'vue3-toastify';
import streamSaver from 'streamsaver';

const augmentParameterStore = useParametersStore()
const range = ref([augmentParameterStore.trainTestSplitParam.trainSize, augmentParameterStore.trainTestSplitParam.trainSize+augmentParameterStore.trainTestSplitParam.validSize]);
const sliderGradient = ref(`linear-gradient(to right, #EDB95E ${range.value[0]}%, #CA2222 ${range.value[1]}%)`);
const train_test_value = ref([range.value[0],100 - range.value[1],range.value[1] - range.value[0]])
const images = ref(0);
const classes = ref(0);

watch(
  () => augmentParameterStore.trainTestSplitParam,
  (newValue) => {
    range.value = [newValue.trainSize, newValue.trainSize + newValue.validSize];
    sliderGradient.value = `linear-gradient(to right, #EDB95E ${range.value[0]}%, #CA2222 ${range.value[1]}%)`
    train_test_value.value = [range.value[0],100 - range.value[1],range.value[1] - range.value[0]]
  },
  { deep: true }
);

function updateTrainSize(value) {
  augmentParameterStore.updateTrainTestSplitParam('trainSize', value)
}

function updateValidSize(value) {
  augmentParameterStore.updateTrainTestSplitParam('validSize', value)
}

function updateTestSize(value) {
  augmentParameterStore.updateTrainTestSplitParam('testSize', value)
}

function updateIsAugment(value) {
  augmentParameterStore.updateIsAugmentParam(value)
}

const onDrag = (value) => {
    const startColor = '#EDB95E';
    const endColor = '#CA2222';
    const start = value[0];
    const end = value[1];
    sliderGradient.value = `linear-gradient(to right, ${startColor} ${start}%, ${endColor} ${end}%)`;
    train_test_value.value =  [value[0],value[1] - value[0],100 - value[1]]
    updateTrainSize(train_test_value.value[0])
    updateValidSize(train_test_value.value[1])
    updateTestSize(train_test_value.value[2])
};

const isDownloading = ref(false);

const onDownload = async () => {
  if (Math.round(images.value*augmentParameterStore.trainTestSplitParam.trainSize/100) == 0) {
    toast.error("Train set size cannot be zero.")
    return
  }
  isDownloading.value = true;
  
  try {
    const requestBody = JSON.stringify({
      augmentation_param: augmentParameterStore.isAugment ? {
        rotate: augmentParameterStore.augmentationParam.rotate,
        flip_horizontal: augmentParameterStore.augmentationParam.flip_horizontal,
        flip_verical: augmentParameterStore.augmentationParam.flip_verical,
        gaussian_noise: augmentParameterStore.augmentationParam.gaussian_noise/100,
        pepper_noise: augmentParameterStore.augmentationParam.pepper_noise/100, 
        scaling: augmentParameterStore.augmentationParam.scaling,
        brightness: augmentParameterStore.augmentationParam.brightness,
        saturation: augmentParameterStore.augmentationParam.saturation,
        contrast: augmentParameterStore.augmentationParam.contrast,
      } : {
        rotate: 0,
        flip_horizontal: false,
        flip_verical: false,
        gaussian_noise: 0,
        pepper_noise: 0,
        scaling: 1,
        brightness: 1,
        saturation: 1,
        contrast: 1,
      },
      train_test_split_param: {
        train_size: augmentParameterStore.trainTestSplitParam.trainSize / 100,
        test_size: augmentParameterStore.trainTestSplitParam.testSize / 100,
        valid_size: augmentParameterStore.trainTestSplitParam.validSize / 100,
      }
    })

    const response = await fetch(`/api/dataset/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
      
    });
    console.log(requestBody)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?\s*$/i);
    const filename = filenameMatch ? filenameMatch[1] : 'dataset.zip';

    // Create a ReadableStream from the response body
    const reader = response.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
      }
    });

    // Create a download link and trigger the download
    const downloadStream = () => {
      const fileStream = streamSaver.createWriteStream(filename);
      stream.pipeTo(fileStream);
    };

    downloadStream();

    toast.success("Dataset downloaded successfully!");
  } catch (err) {
    console.error('Error downloading ZIP file:', err);
    toast.error("Failed to download the dataset. Please try again.");
  } finally {
    isDownloading.value = false;
  }
}

const onReset = () => {
  updateTrainSize(100)
  updateValidSize(0)
  updateTestSize(0)
  updateIsAugment(false)
}

onMounted(async () => {
  try {
    const response = await fetch(`/api/dataset`);
    if(response.ok){
      const responseData = await response.json();
      classes.value = responseData["total_classes"];
      images.value = responseData["total_images"];
      console.log(classes.value)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

</script>

<template>
  <main id="Dataset-page" class="p-10 bg-background w-full">
    <h1 class="text-lg font-medium text-black">Dataset</h1>
    <div id="source-img" class="flex flex-col bg-white rounded-2xl px-8 py-6 mt-9">
      <div class="flex flex-row justify-start items-center">
        <IconSourceImage />
        <span class="text-base font-medium text-sub-primary pl-3">Source Image</span>
      </div>
      <div class="flex flex-col justify-start mt-4">
        <span class="text-sm font-normal text-black pl-8">Image: {{ images }}</span>
        <span class="text-sm font-normal text-black pl-8">Classes: {{ classes }}</span>
      </div>
    </div>
    <div id="train-test-split" class="flex flex-col bg-white rounded-2xl px-8 py-6 mt-9">
        <div class="flex flex-row justify-start items-center mb-4">
            <IconTrainTestSplit />
            <span class="text-base font-medium text-sub-primary pl-3 ">Train/Test Split</span>
        </div>
        <div class="flex flex-row justify-between mb-6">
            <div id="train" class="flex flex-col h-24 p-4 rounded-2xl border border-warning justify-between w-full">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">TRAIN SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-warning px-4 py-1">
                        <span class="text-sm text-white font-bold">{{augmentParameterStore.trainTestSplitParam.trainSize}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*augmentParameterStore.trainTestSplitParam.trainSize/100) }} Images</span>
            </div>
            <div id="valid" class="flex flex-col h-24 p-4 rounded-2xl border border-information justify-between w-full mx-6">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">VALID SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-information px-4 py-1">
                        <span class="text-sm text-white font-bold">{{augmentParameterStore.trainTestSplitParam.validSize}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*augmentParameterStore.trainTestSplitParam.validSize/100) }} Images</span>
            </div>
            <div id="test" class="flex flex-col h-24 p-4 rounded-2xl border border-error justify-between w-full">
                <div class="flex flex-row justify-between">
                    <span class="text-sm text-dark-grey font-medium">TEST SET</span>
                    <div class="flex flex-col justify-center items-center rounded-lg bg-error px-4 py-1">
                        <span class="text-sm text-white font-bold">{{augmentParameterStore.trainTestSplitParam.testSize}} %</span>
                    </div>
                </div>
                <span class="text-sm text-black font-medium">{{ Math.round(images*augmentParameterStore.trainTestSplitParam.testSize/100) }} Images</span>
            </div>
        </div>
        <Slider v-model="range" class="slider" @slide="onDrag" :tooltips="false"/>
    </div>
    <div id="augment" class="flex flex-row bg-white rounded-2xl px-8 py-6 mt-6">
      <div class="flex flex-row justify-between items-center h-8 w-full">
        <div class="flex flex-row justify-start items-center">
          <IconAugment style="color: #459E19;"/>
          <span class="text-base font-medium text-sub-primary pl-3">Augmentation options</span>
          <div class="tooltip">
            <img class="px-1" src="@/assets/images/tooltip.svg" alt="tooltipImg">
            <span class="tooltiptext">Create new training examples for model to learn from by generating augmented versions of each image in your training set.</span>
          </div>
        </div>
        <Toggle class="toggle-bt" v-model="augmentParameterStore.isAugment" :change="updateIsAugment"></Toggle>
      </div>
    </div>
    <div id="action" class="flex flex-row bg-white rounded-2xl px-8 py-6 mt-6">
        <button class="rounded-lg bg-secondary font-medium text-xs text-white px-4 py-2 w-32 shadow" @click="onDownload">Create</button>
        <button class="rounded-lg border border-dark-grey font-medium text-xs text-dark-grey px-4 py-2 w-16 ml-4 shadow " @click="onReset">Reset</button>
    </div>
  </main>
</template>
<style src="@vueform/toggle/themes/default.css"></style>
<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
#train-test-split .slider ::v-deep(.slider-base) {
    background: v-bind(sliderGradient) ;
}
.slider{
    --slider-connect-bg: #4A90E2;
    --slider-handle-ring-color: #4A90E2;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 450px;
  background-color: #EFF1FF;
  color: #ABADAB;
  border:  1px #ABADAB solid;
  text-align: start;
  border-radius: 8px;
  padding: 10px 12px;
  position: absolute;
  font-weight: 400;
  font-size: 14px;
  z-index: 1;
  top: 50%;
  left: 105%; 
  transform: translateY(-10%);
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.toggle-bt{
  --toggle-width: 32px;
  --toggle-height: 18px;
  --toggle-bg-on: #459E19;
  --toggle-border-on: #459E19;
}
</style>
