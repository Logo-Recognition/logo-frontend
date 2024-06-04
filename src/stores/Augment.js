import { defineStore } from 'pinia'

export const useParametersStore = defineStore('parameters', {
  state: () => ({
    augmentationParam: {
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
    trainTestSplitParam: {
      trainSize: 0.7,
      testSize: 0.2,
      validSize: 0.1,
    },
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'parameters',
        storage: localStorage,
        paths: ['augmentationParam', 'trainTestSplitParam'],
      },
    ],
  },
  actions: {
    updateAugmentationParam(param, value) {
      this.augmentationParam[param] = value
    },
    updateTrainTestSplitParam(param, value) {
      this.trainTestSplitParam[param] = value
    },
  },
})