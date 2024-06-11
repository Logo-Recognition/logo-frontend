<script setup>
const props = defineProps({
  imageSrc: String,
  text: String,
})
</script>

<template>
    <div id="row-container">
        <div id="img-section">
          <img :src="props.imageSrc" crossorigin="anonymous">
        </div>
        <div id="txt-section">
          <p>{{ props.text }}</p>
        </div>
    </div>
</template>

<style scoped>
#row-container{
  display: grid;
  grid-template-columns: 1fr 2fr;
}

</style>