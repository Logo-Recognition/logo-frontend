<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { API_URL } from '@/config.js'
import { toast } from 'vue3-toastify'
import JSZip from 'jszip'

const keyword = ref('')
const startDate = ref('')
const endDate = ref('')
const searchQuery = ref('')
const isLoading = ref(false)
const isDropdownOpen = ref(false)
const currentImageIndex = ref(0)
const processedImageUrls = ref([])
const tweetUrls = ref([])

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

const dropdownRef = ref(null)
const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const startScraping = async () => {
  if (!keyword.value || !startDate.value || !endDate.value) {
    alert('Please fill in all fields before scraping.')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(
      `${API_URL}/api/scrape?keyword=${encodeURIComponent(keyword.value)}&start_date=${startDate.value}&end_date=${endDate.value}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to start scraping.')
    }

    const data = await response.json()
    console.log('Scraping response:', data)

    if (data.predicted_url && Array.isArray(data.predicted_url)) {
      processedImageUrls.value = data.predicted_url.map((item) => item.url).filter(Boolean)
      tweetUrls.value = data.predicted_url.map((item) => item.tweet_url).filter(Boolean)
    } else {
      console.error('Unexpected response format', data)
      alert('Error: No images found.')
    }

    alert('Scraping started successfully!')
  } catch (error) {
    console.error(error)
    alert('An error occurred while starting the scraping.')
  } finally {
    isLoading.value = false
  }
}

const downloadAllImages = async () => {
  if (processedImageUrls.value.length === 0) {
    toast.error('No images to download.', {
      autoClose: 3000
    })
    return
  }

  try {
    const zip = new JSZip()
    const folder = zip.folder('images')

    for (let i = 0; i < processedImageUrls.value.length; i++) {
      const imageUrl = processedImageUrls.value[i]
      const filename = `image_${i + 1}.jpg`

      const response = await fetch(imageUrl)
      const imageBlob = await response.blob()
      folder.file(filename, imageBlob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = window.URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'images.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Images downloaded successfully!', {
      autoClose: 3000
    })
  } catch (error) {
    toast.error('Error downloading images.', {
      autoClose: 3000
    })
    console.error('Error downloading images:', error)
  }
}

const showNextImage = () => {
  if (currentImageIndex.value < processedImageUrls.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const showPreviousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = processedImageUrls.value.length - 1
  }
}

// Function to set the current image index
const setImageIndex = (index) => {
  currentImageIndex.value = index
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
      <input type="date" v-model="startDate" class="w-full mt-1 p-2 border rounded-lg" />
    </div>

    <div>
      <label class="block text-gray-700 font-semibold">End Date</label>
      <input type="date" v-model="endDate" class="w-full mt-1 p-2 border rounded-lg" />
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

  <!-- Display while images are being processed -->
  <div v-if="isLoading">
    <div id="show-picture-card">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <h3>Result</h3>
        </div>
        <div class="navigation-buttons flex items-center">
          <button
            @click="toggleDropdown"
            :class="{ active: showDropdown }"
            id="predicted-bar-button"
            disabled
          >
            <IconView />
          </button>
          <button @click="downloadAllImages" disabled><IconDownload /></button>
        </div>
      </div>
      <div class="show-predicted flex justify-around">
        <div id="the-predicted-image" class="grid place-content-center"><LoadingIndicator /></div>
      </div>
    </div>
  </div>

  <!-- Display after images are processed -->
  <div v-if="processedImageUrls.length > 0">
    <div id="show-picture-card" v-if="processedImageUrls.length > 0">
      <div class="flex justify-between items-center">
        <div class="flex items-center flex-1">
          <div class="flex flex-col">
            <h3>Result</h3>
          </div>
        </div>

        <div class="flex-1 text-center">
          <p>{{ currentImageIndex + 1 }} / {{ processedImageUrls.length }}</p>
        </div>

        <div class="navigation-buttons flex items-center flex-1 justify-end">
          <button
            @click="toggleDropdown"
            :class="{ active: showDropdown }"
            id="predicted-bar-button"
          >
            <IconView />
          </button>
          <button @click="downloadAllImages"><IconDownload /></button>
        </div>
      </div>
      <div class="show-predicted flex justify-around">
        <button @click="showPreviousImage"><IconArrowL /></button>
        <img
          v-if="processedImageUrls.length > 0"
          :src="processedImageUrls[currentImageIndex]"
          alt="Processed Image"
          crossorigin="anonymous"
          id="the-predicted-image"
        />
        <button @click="showNextImage"><IconArrowR /></button>
      </div>
      <div v-if="showDropdown" class="mt-2">
        <div class="preview-container">
          <div class="preview-area">
            <div v-for="(image, index) in processedImageUrls" :key="index" class="preview-items">
              <img
                v-lazy="image"
                class="preview-img"
                @click="setImageIndex(index)"
                crossorigin="anonymous"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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

#show-picture-card {
  width: 95%; /* Adjust the width percentage as needed */
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
  background-color: #ffffff;
}

#show-picture-card h3 {
  font-size: 20px;
  font-weight: 700;
}

#the-predicted-image {
  width: 70%; /* Limit the maximum width */
  height: 400px; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the entire image fits within the set dimensions */
  /* border-radius: 16px; */
  border: 1px dashed #3745be;
  padding: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 10px;
  justify-items: center;
}

.grid-item {
  width: 100%;
  height: auto;
  padding: 5px;
}

.grid-item img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.dropdown-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 300px; /* Adjust as needed */
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  z-index: 1000;
}

.dropdown-item {
  width: 50px;
  height: 50px;
  margin: 5px;
  cursor: pointer;
}

.dropdown-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-area {
  display: inline-flex; /* Use flexbox layout */
  gap: 10px; /* Add spacing between items */
}

.preview-items {
  flex: 0 0 auto; /* Prevent items from shrinking */
}

.preview-img {
  border-radius: 10px;
  width: 150px;
  height: 100px;
  object-fit: fill;
  cursor: pointer;
  margin-top: 5px;
}

#predicted-bar-button {
  color: #5a5d6c;
}

#predicted-bar-button.active {
  color: #7585ff;
}
</style>
