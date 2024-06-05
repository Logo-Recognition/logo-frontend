<script setup>
import Popup from '@/components/AddClassessPopup.vue'
import IconPlus from './icon/IconPlus.vue'
import IconBin from './icon/IconBin.vue'

import { ref } from 'vue'
const classes = ref([])
const input_content = ref('')
// const addClass = () => {
//   if (input_content.value.trim() === '') {
//     return
//   }
//   classes.value.push({
//     content: input_content.value
//   })
//   input_content.value = ''
// }
const removeClass = (classToRemove) => {
  classes.value = classes.value.filter((c) => c !== classToRemove)
}
// AddClassPopup implement zone
const popupTriggers = ref({
  buttonTrigger: false
})

const togglePopup = () => {
  popupTriggers.value.buttonTrigger = !popupTriggers.value.buttonTrigger
}
</script>

<template>
  <main id="Class-page" class="flex-col">
    <div id="title">Classes</div>
    <div id="class-box" class="flex-col justify-self-center">
      <form id="form" @submit.prevent="togglePopup" class="flex justify-between">
        <input id="input-box" type="text" placeholder="Class Name" v-model="input_content" />
        <button type="submit" id="add-button" class="flex"><IconPlus /> &nbsp; Add Classes</button>
      </form>
      <hr />
      {{ popupTriggers }}
      <div v-for="(item, index) in classes" :key="index">
        <div id="class-item" class="flex justify-between">
          <label>{{ item.content }}</label>
          <div id="delete-button">
            <button class="delete" @click="removeClass(item)"><IconBin /></button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Popup v-if="popupTriggers.buttonTrigger" :togglePopup="togglePopup">

  </Popup>
</template>

<style scoped>
#class-box {
  width: 1200px; /* Adjust the width percentage as needed */
  min-height: 381px;
  height: auto; /* Adjust the height as needed */
  border-radius: 16px;
  padding: 20px;
  background-color: #fefefe;
  margin: 30px;
}
#Class-page {
  width: 100%;
  background-color: #f0f0f0;
  padding: 10px;
}
#input-box {
  outline: none;
  width: 600px;
}
#title {
  font-size: 18px;
  margin: 30px;
  font-weight: bold;
}
#form {
  margin: 10px;
}
#class-item {
  margin: 10px;
}
#add-button {
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px;
  font-weight: bold;
  font-size: 13px;
  align-items: center;
  width: 118px;
  height: 32px;
  justify-content: center; /* Horizontally center the content */
  align-items: center; /* Vertically center the content */
}
#delete-button {
  background-color: #fff1f1;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center; /* Horizontally center the content */
  align-items: center; /* Vertically center the content */
}
</style>
