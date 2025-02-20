<script setup>
import { ref } from 'vue'

const keyword = ref('')
const startDate = ref('')
const endDate = ref('')

const brands = [
  'Adidas',
  'Aldi',
  'Apple',
  'Becks',
  'BMW',
  'Carlsberg',
  'Chimay',
  'Coca-Cola',
  'Corona',
  'DHL',
  'Erdinger',
  'Esso',
  'Fedex',
  'Ferrari',
  'Ford',
  "Foster's",
  'Google',
  'Guiness',
  'Heineken',
  'HP',
  'Milka',
  'Nvidia',
  'Paulaner',
  'Pepsi',
  'Ritter Sport',
  'Shell',
  'Singha',
  'Starbucks',
  'Stella Artois',
  'Texaco',
  'Tsingtao',
  'UPS'
]

const startScraping = () => {
  console.log('Scraping started with:', {
    keyword: keyword.value,
    startDate: startDate.value,
    endDate: endDate.value
  })
  // Add your scraping logic here
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div>
      <label class="block text-gray-700 font-semibold">Keyword</label>
      <select v-model="keyword" class="w-full mt-1 p-2 border rounded-lg">
        <option value="" disabled>Select</option>
        <option v-for="brand in brands" :key="brand" :value="brand">
          {{ brand }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-gray-700 font-semibold">Start Date</label>
      <input type="date" v-model="startDate" class="w-full mt-1 p-2 border rounded-lg" />
    </div>

    <div>
      <label class="block text-gray-700 font-semibold">End Date</label>
      <input type="date" v-model="endDate" class="w-full mt-1 p-2 border rounded-lg" />
    </div>
  </div>

  <div class="mt-4 flex flex-row">
    <button class="scrape-button" @click="startScraping">Start Scraping</button>
  </div>
</template>

<style scoped>
.scrape-button {
  width: 124px;
  height: 32px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #7585ff;
  color: #fefefe;
  padding: auto;
}
</style>
