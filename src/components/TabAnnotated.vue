<template>
  <div class="annotated-container">
    <div class="image-container">
      <div v-for="image in annotatedImages" :key="image.id" class="image-wrapper">
        <img :src="image.src" :alt="image.alt" class="dummy-image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabAnnotated',
  props: {
    annotatedImages: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.annotated-container {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  flex: 1;
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
