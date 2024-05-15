<template>
  <div class="image-container">
    <div v-for="image in unannotatedImages" :key="image.id" class="image-wrapper">
      <img :src="image.src" :alt="image.alt" class="dummy-image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabUnannotated',
  props: {
    unannotatedImages: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

.image-wrapper {
  margin: 8px;
}

.dummy-image {
  border-radius: 16px;
  width: 100px;
  height: 100px;
}
</style>
