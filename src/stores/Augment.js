// src/stores/useParametersStore.js
import { defineStore } from 'pinia'

export const useParametersStore = defineStore('parameters', {
  state: () => ({
    augmentationParam: {
      rotate: 50,
      flipHorizontal: true,
      flipVertical: true,
      gaussianNoise: 5,
      pepperNoise: 5,
      scaling: 120,
      brightness: 1,
      saturation: 1,
      contrast: 1,
    },
    trainTestSplitParam: {
      trainSize: 0.7,
      testSize: 0.2,
      validSize: 0.1,
    },
  }),
  actions: {
    updateAugmentationParam(param, value) {
      this.augmentationParam[param] = value
    },
    updateTrainTestSplitParam(param, value) {
      this.trainTestSplitParam[param] = value
    },
  },
})
