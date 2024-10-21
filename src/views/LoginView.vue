<script setup>
// Add any JavaScript logic or component imports here
import { ref } from 'vue';

const message = ref('Hello, Vue 3!');
</script>

<template>
  <div class="new-page">
    <h1>New Page</h1>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.new-page {
  text-align: center;
  margin-top: 50px;
}

h1 {
  font-size: 2rem;
  color: #42b983;
}

p {
  font-size: 1.2rem;
}
</style>
