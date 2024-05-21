<template>
    <div>
      <div class="flex ">
        <input
          id="option1"
          v-model="selectedOption"
          type="radio"
          value="option1"
          class="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
        />
        <label for="option1" class="ml-2 block text-sm font-medium text-gray-700">
          Option 1
        </label>
      </div>
      <div class="flex items-center">
        <input
          id="option2"
          v-model="selectedOption"
          type="radio"
          value="option2"
          class="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
        />
        <label for="option2" class="ml-2 block text-sm font-medium text-gray-700">
          Option 2
        </label>
      </div>
      <div class="flex items-center">
        <input
          id="option3"
          v-model="selectedOption"
          type="radio"
          value="option3"
          class="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
        />
        <label for="option3" class="ml-2 block text-sm font-medium text-gray-700">
          Option 3
        </label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const selectedOption = ref(null);
  </script>