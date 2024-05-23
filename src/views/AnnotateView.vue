<script setup>
import { ref, onMounted } from 'vue'
import TabUnannotated from '@/components/TabUnannotated.vue'
import TabAnnotated from '@/components/TabAnnotated.vue'
import { API_URL } from '@/config.js'

const currentTab = ref('Unannotated')
const unannotatedImages = ref([])
const annotatedImages = ref([])

function getTabClass(tab) {
  const isActive = currentTab.value === tab
  return [
    'my-2 block px-7 pb-3.5 pt-4 text-s font-medium leading-tight',
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-grey-text border-b-2 border-grey-border hover:border-primary hover:text-primary'
  ].join(' ')
}

async function fetchImages(tab) {
  try {
    const lowerCaseTab = tab.toLowerCase()
    const response = await fetch(`${API_URL}/api/images/${lowerCaseTab}`, {
      method: 'GET'
    })
    if (response.ok) {
      const imageUrls = await response.json()
      const images = imageUrls.map((url, index) => ({
        id: `image-${index}`,
        src: url,
        alt: `Image ${index + 1}`
      }))
      if (lowerCaseTab === 'unannotated') {
        unannotatedImages.value = images
      } else if (lowerCaseTab === 'annotated') {
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

onMounted(() => {
  fetchImages('Unannotated')
})
</script>

<template>
  <div class="annotate-container">
    <h1 class="page-title text-dark">Annotate</h1>
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
            >{{ unannotatedImages.length }}</span
          >
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
            >{{ annotatedImages.length }}</span
          >
        </a>
      </li>
    </ul>
    <div
      v-if="currentTab === 'Unannotated'"
      class="tab-content"
      id="tabs-unannotated"
      role="tabpanel"
    >
      <TabUnannotated :unannotatedImages="unannotatedImages" />
    </div>
    <div
      v-else-if="currentTab === 'Annotated'"
      class="tab-content"
      id="tabs-annotated"
      role="tabpanel"
    >
      <TabAnnotated :annotatedImages="annotatedImages" />
    </div>
  </div>
</template>

<style scoped>
.annotate-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  padding-left: 40px;
  padding-right: 60px;
}

.page-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.tab-content {
  transition: opacity 0.3s ease-in-out;
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
