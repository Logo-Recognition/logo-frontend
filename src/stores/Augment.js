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
      trainSize: 70,
      validSize: 10,
      testSize: 20,
    },
    isAugment: false,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'parameters',
        storage: localStorage,
        paths: ['augmentationParam', 'trainTestSplitParam','isAugment'],
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
    updateIsAugmentParam(value) {
      this.isAugment = value
    },
  },
})