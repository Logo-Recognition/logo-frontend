<template>
  <div class="annotate-container">
    <h1 class="page-title text-dark-primary">Annotate</h1>
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
          @click="currentTab = 'Annotated'"
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
      unannotatedImages: [
        {
          id: 1,
          src: 'https://media.discordapp.net/attachments/881624576671510529/1238378607852650577/placeholder.png?ex=663f1174&is=663dbff4&hm=3c766982c7c2ee5970c54be5bf7d3dde0f26ca64f68d6da57f6ce385adc6359d&=&format=webp&quality=lossless&width=375&height=312',
          alt: 'Image 1'
        }
      ],
      annotatedImages: [
        {
          id: 2,
          src: 'https://media.discordapp.net/attachments/881624576671510529/1238378607852650577/placeholder.png?ex=663f1174&is=663dbff4&hm=3c766982c7c2ee5970c54be5bf7d3dde0f26ca64f68d6da57f6ce385adc6359d&=&format=webp&quality=lossless&width=375&height=312',
          alt: 'Image 2'
        },
        {
          id: 3,
          src: 'https://media.discordapp.net/attachments/881624576671510529/1238378607852650577/placeholder.png?ex=663f1174&is=663dbff4&hm=3c766982c7c2ee5970c54be5bf7d3dde0f26ca64f68d6da57f6ce385adc6359d&=&format=webp&quality=lossless&width=375&height=312',
          alt: 'Image 3'
        }
      ]
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
    }
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
  font-size: 24px;
  font-weight: bold;
}

.tab-content {
  transition: opacity 0.3s ease-in-out;
}

.badge {
  padding: 4px 8px;
  border-radius: 50%;
  font-size: 12px;
  margin-left: 8px;
}

.outline-sub-primary {
  border: 1px solid;
}
</style>
