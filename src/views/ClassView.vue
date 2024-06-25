<script setup>
import Popup from '@/components/AddClassessPopup.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconBin from '@/components/icons/IconBin.vue'
import { API_URL } from '@/config.js'

import { ref, onMounted } from 'vue'

// Defining reactive variables
const classes = ref([]) // the list of classes
// const input_content = ref('')
const popupTriggers = ref({
  buttonTrigger: false // Determines if the popup should be displayed
})
const pathPublic = `${API_URL}/api/class` // API endpoint for classes

const isLoading = ref(true) // Indicates if the data is being loaded
const error = ref(null) // Holds any error messages

// Function to fetch the list of classes from the API
const fetchClasses = async () => {
  try {
    const response = await fetch(pathPublic)
    const data = await response.json()

    if (response.ok) {
      classes.value = data.classes // Updating the classes list with data from the API
    } else {
      error.value = 'An error occurred while fetching class data.' // Setting error message
    }
  } catch (err) {
    error.value = 'An error occurred while fetching class data.' // Setting error message
    console.error(err)
  } finally {
    isLoading.value = false // Setting isLoading to false after the fetch operation
  }
}

// Fetching classes when the component is mounted
onMounted(fetchClasses)

// Function to remove a class
const removeClass = async (className) => {
  try {
    const response = await fetch(pathPublic, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucket_name: className }) // Sending the class name to be deleted
    })
    const data = await response.json()

    if (response.ok) {
      await fetchClasses() // Fetching the updated class list after successful deletion
    } else {
      error.value = data.error // Setting error message
    }
  } catch (err) {
    error.value = 'An error occurred while adding the new class.' // Setting error message
    console.error(err)
  }
}

// Function to toggle the popup display
const togglePopup = () => {
  popupTriggers.value.buttonTrigger = !popupTriggers.value.buttonTrigger
}
</script>

<template>
  <main id="Class-page" class="flex-col">
    <div id="title">Classes</div>
    <div id="ShowClass-Section" class="flex-col justify-self-center">
      <form id="form" @submit.prevent="togglePopup" class="flex justify-between">
        <input
          id="input-box"
          type="text"
          placeholder="Class Name"
          v-model="input_content"
          disabled
        />
        <button type="submit" id="AddClass-button" class="flex">
          <IconPlus /> &nbsp; Add Classes
        </button>
      </form>
      <hr />
      <div v-for="(item, index) in classes" :key="index">
        <div id="class-item" class="flex justify-between">
          <label>{{ item }}</label>
          <div id="DeleteClass-button">
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
#ShowClass-Section {
  width: 95%;
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
#AddClass-button {
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
#DeleteClass-button {
  background-color: #fff1f1;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center; /* Horizontally center the content */
  align-items: center; /* Vertically center the content */
}
#input-box {
  background-color: #fefefe;
}
</style>
