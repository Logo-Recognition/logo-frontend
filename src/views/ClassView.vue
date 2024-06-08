<script setup>
import Popup from '@/components/AddClassessPopup.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconBin from '@/components/icons/IconBin.vue'

import { ref, onMounted } from 'vue'
const classes = ref([])
const input_content = ref('')
const popupTriggers = ref({
  buttonTrigger: false
})
const pathPublic = 'http://192.168.2.44:5000/api/class'
// const pathPublic = "http://127.0.0.1:5000/api/class"

const isLoading = ref(true)
const error = ref(null)

const fetchClasses = async () => {
  try {
    const response = await fetch(pathPublic)
    const data = await response.json()

    if (response.ok) {
      classes.value = data.classes
    } else {
      error.value = 'An error occurred while fetching class data.'
    }
  } catch (err) {
    error.value = 'An error occurred while fetching class data.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchClasses)

const removeClass = async (className) => {
  try {
    const response = await fetch(pathPublic, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucket_name: className })
    })
    const data = await response.json()

    if (response.ok) {
      // Fetch updated class list after successful addition
      console.log('sdsdsd')
      await fetchClasses()
    } else {
      error.value = data.error
    }
  } catch (err) {
    error.value = 'An error occurred while adding the new class.'
    console.error(err)
  }
}

const togglePopup = () => {
  popupTriggers.value.buttonTrigger = !popupTriggers.value.buttonTrigger
}
</script>

<template>
  <main id="Class-page" class="flex-col">
    <div id="title">Classes</div>
    <div id="class-box" class="flex-col justify-self-center">
      <form id="form" @submit.prevent="togglePopup" class="flex justify-between">
        <input
          id="input-box"
          type="text"
          placeholder="Class Name"
          v-model="input_content"
          disabled
        />
        <button type="submit" id="add-button" class="flex"><IconPlus /> &nbsp; Add Classes</button>
      </form>
      <hr />
      <div v-for="(item, index) in classes" :key="index">
        <div id="class-item" class="flex justify-between">
          <label>{{ item }}</label>
          <div id="delete-button">
            <button class="delete" @click="removeClass(item)"><IconBin /></button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Popup v-if="popupTriggers.buttonTrigger" :fetchClasses="fetchClasses" :togglePopup="togglePopup">
  </Popup>
</template>

<style scoped>
#Class-page {
  width: 100%;
  padding: 10px;
}
#class-box {
  width: 95%; /* Adjust the width percentage as needed */
  min-height: 381px;
  height: auto;
  border-radius: 16px;
  background-color: #fefefe;
  padding: 20px;
  margin: 30px;
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
#input-box {
  background-color: #FEFEFE;
}

</style>
