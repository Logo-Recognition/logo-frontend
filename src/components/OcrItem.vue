<script setup>
const props = defineProps({
  imageSrc: String,
  text: String,
})
</script>

<template>
    <div id="row-container" class="max-h-60">
        <div id="img-section" class="ml-6">
          <img v-lazy="props.imageSrc" class="h-full rounded-xl object-fill "  crossorigin="anonymous">
        </div>
        <div id="txt-section" class="mx-6 py-8 px-6 border border-secondary rounded-xl bg-light">
          <p>{{ props.text }}</p>
        </div>
    </div>
</template>

<style scoped>
#row-container{
  display: grid;
  grid-template-columns: 1fr 2fr;
  margin-bottom: 24px
}

</style>