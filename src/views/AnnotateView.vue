<template>
  <div class="annotate-container">
    <h1 class="page-title text-dark-primary">Annotate</h1>
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
              'bg-sub-primary text-white': currentTab === 'Unannotated',
              'outline-sub-primary': currentTab !== 'Unannotated'
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
              'bg-sub-primary text-white': currentTab === 'Annotated',
              'outline-sub-primary border-light-grey': currentTab !== 'Annotated'
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

<script>
import TabUnannotated from '@/components/TabUnannotated.vue'
import TabAnnotated from '@/components/TabAnnotated.vue'

export default {
  name: 'Annotated',
  components: {
    TabUnannotated,
    TabAnnotated
  },
  data() {
    return {
      currentTab: 'Unannotated',
      unannotatedImages: [],
      annotatedImages: []
    }
  },
  methods: {
    getTabClass(tab) {
      const isActive = this.currentTab === tab
      return [
        'my-2 block px-7 pb-3.5 pt-4 text-s font-medium leading-tight',
        isActive
          ? 'text-sub-primary border-b-2 border-sub-primary'
          : 'text-dark-grey border-b-2 border-light-grey hover:border-sub-primary hover:text-sub-primary'
      ].join(' ')
    },
    async fetchImages(tab) {
      try {
        const response = await fetch(`/api/images/logo-img`)
        if (response.ok) {
          const images = await response.json()
          if (tab === 'Unannotated') {
            this.unannotatedImages = images
          } else if (tab === 'Annotated') {
            this.annotatedImages = images
          }
        } else {
          console.error('Error fetching images')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    switchTab(tab) {
      this.currentTab = tab
      this.fetchImages(tab)
    }
  },
  mounted() {
    this.fetchImages('Unannotated')
  }
}
</script>

<style scoped>
.annotate-container {
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

.outline-sub-primary {
  border: 1px solid;
}
</style>
