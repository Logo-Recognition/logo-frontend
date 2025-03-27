<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits, watch } from 'vue'
import { toast } from 'vue3-toastify'


const keyword = ref('')
const startDate = ref('')
const endDate = ref('')
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const isLoading = ref(false)
const processedImageUrls = ref([])
const tweetUrls = ref([])

const emits = defineEmits(['scraping-completed'])

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

const filteredBrands = computed(() => {
  return brands.filter((brand) => brand.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const selectKeyword = (brand) => {
  keyword.value = brand
  searchQuery.value = brand
  isDropdownOpen.value = false
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

const minStartSelectableDate = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  return today.toISOString().split('T')[0]
})

const minEndSelectableDate = computed(() => {
  if (startDate.value) {
    return startDate.value
  }

  const today = new Date()
  today.setDate(today.getDate() - 7)
  return today.toISOString().split('T')[0]
})

const maxSelectableDate = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() - 1)
  return today.toISOString().split('T')[0]
})

watch(startDate, (newStartDate) => {
  if (endDate.value && endDate.value < newStartDate) {
    endDate.value = ''
  }
})

const startScraping = async () => {
  if (!keyword.value || !startDate.value || !endDate.value) {
    toast.warn('Please fill in all fields before scraping.', {
      autoClose: 3000
    })
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(
      `/api/scrape?keyword=${encodeURIComponent(keyword.value)}&start_date=${startDate.value}&end_date=${endDate.value}`
    )

    const data = await response.json()
    console.log('Scraping response:', data)

    if (!response.ok) {
      
      if (response.status === 503) {
      throw new Error(`Waiting ${data.retry_after} seconds for available key`)
      console.log(response)
      }
      throw new Error('Failed to start scraping.')
    }

    if (data.predicted_url && Array.isArray(data.predicted_url)) {
      processedImageUrls.value = data.predicted_url.map((item) => item.image_url).filter(Boolean)
      tweetUrls.value = data.predicted_url.map((item) => item.tweet_url).filter(Boolean)
      emits('scraping-completed', processedImageUrls.value)
    } else {
      console.error('Unexpected response format', data)
      toast.error('Error: No images found.', {
        autoClose: 3000
      })
    }
    toast.success('Scraping started successfully!', {
      autoClose: 3000
    })
  } catch (error) {
    console.log(error.message)
    toast.error(error.message || 'An unexpected error occurred', {
      autoClose: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div class="relative" ref="dropdownRef">
      <label class="block text-gray-700 font-semibold">Keyword</label>
      <input
        v-model="searchQuery"
        @focus="isDropdownOpen = true"
        @input="isDropdownOpen = true"
        placeholder="Search brand"
        class="w-full mt-1 p-2 border rounded-lg"
      />
      <div
        v-if="isDropdownOpen"
        class="absolute w-full mt-1 bg-white border rounded-lg shadow-md z-10 max-h-48 overflow-y-auto"
      >
        <div
          v-for="brand in filteredBrands"
          :key="brand"
          @click="selectKeyword(brand)"
          class="p-2 cursor-pointer hover:bg-gray-100"
        >
          {{ brand }}
        </div>
      </div>
    </div>

    <div>
      <label class="block text-gray-700 font-semibold">Start Date</label>
      <input
        type="date"
        v-model="startDate"
        :min="minStartSelectableDate"
        :max="maxSelectableDate"
        :class="{ 'has-value': startDate !== '' }"
        class="w-full mt-1 p-2 border rounded-lg"
      />
    </div>

    <div>
      <label class="block text-gray-700 font-semibold">End Date</label>
      <input
        type="date"
        v-model="endDate"
        :min="minEndSelectableDate"
        :max="maxSelectableDate"
        :class="{ 'has-value': endDate !== '' }"
        class="w-full mt-1 p-2 border rounded-lg"
      />
    </div>
  </div>

  <div class="mt-4 flex flex-row">
    <button
      @click="startScraping"
      :disabled="isLoading"
      class="scrape-button"
      :class="isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'"
    >
      {{ isLoading ? 'Scraping...' : 'Start Scraping' }}
    </button>
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

input[type='date']::-webkit-datetime-edit-text,
input[type='date']::-webkit-datetime-edit-month-field,
input[type='date']::-webkit-datetime-edit-day-field,
input[type='date']::-webkit-datetime-edit-year-field {
  color: #9ca3af;
}

input[type='date'].has-value::-webkit-datetime-edit-text,
input[type='date'].has-value::-webkit-datetime-edit-month-field,
input[type='date'].has-value::-webkit-datetime-edit-day-field,
input[type='date'].has-value::-webkit-datetime-edit-year-field {
  color: #000000;
}
</style>
