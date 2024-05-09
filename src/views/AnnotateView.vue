<template>
  <div class="annotated-container">
    <h1 class="page-title text-primary">Annotate</h1>

    <ul class="mb-5 flex list-none flex-row flex-wrap border-b-0 ps-0" role="tablist">
      <li role="presentation">
        <a
          :class="getTabClass('Unannotated')"
          @click="currentTab = 'Unannotated'"
          role="tab"
          aria-controls="tabs-unannotated"
          aria-selected="currentTab === 'Unannotated'"
        >
          Unannotated
        </a>
      </li>
      <li role="presentation">
        <a
          :class="getTabClass('Annotated')"
          @click="currentTab = 'Annotated'"
          role="tab"
          aria-controls="tabs-annotated"
          aria-selected="currentTab === 'Annotated'"
        >
          Annotated
        </a>
      </li>
    </ul>

    <div
      v-if="currentTab === 'Unannotated'"
      class="tab-content"
      id="tabs-unannotated"
      role="tabpanel"
    >
      <TabUnannotated />
    </div>
    <div
      v-else-if="currentTab === 'Annotated'"
      class="tab-content"
      id="tabs-annotated"
      role="tabpanel"
    >
      <TabAnnotated />
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
      currentTab: 'Unannotated'
    }
  },
  methods: {
    getTabClass(tab) {
      const isActive = this.currentTab === tab
      return [
        'my-2 block px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight',
        isActive ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 border-transparent'
      ].join(' ')
    }
  }
}
</script>

<style scoped>
.annotated-container {
  padding: 16px;
}

.page-title {
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
}

.tab-content {
  transition: opacity 0.3s ease-in-out;
}
</style>
