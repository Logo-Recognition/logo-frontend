<script setup>
import { ref, onMounted } from 'vue'
import AnnotationCanvas from '@/components/AnnotationCanvas.vue'
import { API_URL } from '@/config.js'

const currentTab = ref('Unannotated')
const unannotatedImages = ref([])
const annotatedImages = ref([])

const annotationCanvas = ref(null)

function getTabClass(tab) {
  const isActive = currentTab.value === tab
  return [
    'my-2 block px-7 pb-3.5 pt-4 text-s font-medium leading-tight',
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-grey-text border-b-2 border-grey-border hover:border-dark hover:text-dark hover:border-dark'
  ].join(' ')
}

async function fetchImages(tab) {
  try {
    const endpoint = tab.toLowerCase() === 'unannotated' ? 'images' : 'annotated-images'
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: 'GET'
    })
    if (response.ok) {
      const imageUrls = await response.json()
      const images = imageUrls.map((url, index) => ({
        id: `image-${index}`,
        src: url,
        alt: `Image ${index + 1}`
      }))
      if (tab.toLowerCase() === 'unannotated') {
        unannotatedImages.value = images
      } else if (tab.toLowerCase() === 'annotated') {
        annotatedImages.value = images
      }
    } else {
      console.error('Error fetching images')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

function switchTab(tab) {
  currentTab.value = tab
  fetchImages(tab)
}

function loadImageToCanvas(imageSrc) {
  annotationCanvas.value.loadImage(imageSrc)
}

onMounted(() => {
  fetchImages('Unannotated')
})
</script>

<template>
  <div class="annotate-container">
    <h1 class="page-title text-lg text-dark font-bold">Annotate</h1>
    <div class="annotation-section">
      <AnnotationCanvas ref="annotationCanvas" class="canvas-container" />
      <div class="labels-container bg-white">
        <h2>Labels</h2>
        <div v-for="object in canvas?.getObjects()" :key="object.id" class="label-item">
          Label for object
        </div>
      </div>
      <div class="images-container">
        <ul class="mb-5 text-sm flex list-none flex-row flex-wrap border-b-0 ps-0" role="tablist">
          <li role="presentation">
            <a
              :class="getTabClass('Unannotated')"
              @click="switchTab('Unannotated')"
              role="tab"
              aria-controls="tabs-unannotated"
              aria-selected="currentTab === 'Unannotated'"
            >
              Unannotated
              <span
                class="badge"
                :class="{
                  'bg-primary text-light': currentTab === 'Unannotated',
                  'outline-badge border-grey-text': currentTab !== 'Unannotated'
                }"
              >
                {{ unannotatedImages.length }}
              </span>
            </a>
          </li>
          <li role="presentation">
            <a
              :class="getTabClass('Annotated')"
              @click="switchTab('Annotated')"
              role="tab"
              aria-controls="tabs-annotated"
              aria-selected="currentTab === 'Annotated'"
            >
              Annotated
              <span
                class="badge"
                :class="{
                  'bg-primary text-light': currentTab === 'Annotated',
                  'outline-badge border-grey-text': currentTab !== 'Annotated'
                }"
              >
                {{ annotatedImages.length }}
              </span>
            </a>
          </li>
        </ul>
        <div
          v-if="currentTab === 'Unannotated'"
          class="tab-content"
          id="tabs-unannotated"
          role="tabpanel"
        >
          <div class="image-grid">
            <div
              v-for="image in unannotatedImages"
              :key="image.id"
              class="image-item"
              @click="loadImageToCanvas(image.src)"
            >
              <img :src="image.src" :alt="image.alt" class="image" />
            </div>
          </div>
        </div>
        <div
          v-else-if="currentTab === 'Annotated'"
          class="tab-content"
          id="tabs-annotated"
          role="tabpanel"
        >
          <div class="image-grid">
            <div
              v-for="image in annotatedImages"
              :key="image.id"
              class="image-item"
              @click="loadImageToCanvas(image.src)"
            >
              <img :src="image.src" :alt="image.alt" class="image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotate-container {
  padding: 32px 60px 40px 40px;
}

.page-title {
  margin-bottom: 16px;
}

.annotation-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 32px 24px;
}

.canvas-container {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

.labels-container {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  border-radius: 16px;
  padding: 16px;
  overflow-y: auto;
}

.label-item {
  padding: 4px;
  border-bottom: 1px solid #d8dbd8;
}

.images-container {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  max-height: 60%;
  overflow-y: auto;
}

.image-item {
  margin-right: 16px;
  margin-bottom: 16px;
  height: 100px;
  width: calc(50% - 16px);
  max-width: none;
  cursor: pointer;
}

.image {
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
  width: 100%;
  height: 100%;
}

.image:hover {
  transform: scale(1.05);
}

.tab-content {
  transition: opacity 0.3s ease-in-out;
  display: flex;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 100%;
  font-size: 12px;
  margin-left: 8px;
}

.outline-badge {
  border: 1px solid;
}
</style>
