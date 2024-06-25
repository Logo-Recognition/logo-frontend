<script setup>
import IconClose from './icons/IconClose.vue'
import { defineProps, ref } from 'vue'
import { API_URL } from '@/config.js'

// API path for class addition
const pathPublic = `${API_URL}/api/class`

// Props received from parent component
const props = defineProps({
  fetchClasses: Function, // Function to fetch classes after adding new ones
  togglePopup: Function // Function to toggle the visibility of the popup
})

// Reactive variables
const inputData = ref('') // Input field for comma-separated class names
const isValid = ref(false) // Flag indicating if input is valid
const errorMessage = ref('') // Error message for displaying validation errors

// Function to submit form data
const submitData = () => {
  if (validateInput()) {
    addClass(inputData.value) // Call function to add classes
    closePopup() // Close the popup after submitting data
  }
}

// Function to process and add new classes
const addClass = async (classNames) => {
  const newClasses = classNames
    .split(',') // Split input string by comma
    .map(name => name.trim()) // Trim whitespace around each class name
    .filter(name => name !== '') // Filter out empty class names

  for (const className of newClasses) {
    await PostClass(className) // Call function to post each class name
  }
}

// Function to post a single class name
const PostClass = async (newClassName) => {
  try {
    const response = await fetch(pathPublic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucket_name: newClassName }) // Send class name in JSON format
    })
    const data = await response.json() // Parse response JSON

    if (data.success) {
      props.fetchClasses(null) // Fetch classes after successful addition
    } else {
      errorMessage.value = data.error || 'Failed to add the class.' // Set error message on failure
      console.error(errorMessage.value)
    }
  } catch (err) {
    errorMessage.value = 'An error occurred while adding the new class.' // Set error message on exception
    console.error(err)
  }
}

// Function to validate input data
const validateInput = () => {
  const inputValues = inputData.value
    .split(',') // Split input string by comma
    .map((name) => name.trim()) // Trim whitespace around each value
    .filter((name) => name !== '') // Filter out empty values

  const inputPattern = /^[a-z0-9]+$/ // Regex pattern for lowercase letters and digits
  const isAnyValueTooShort = inputValues.some((value) => value.length < 3) // Check for values shorter than 3 characters
  const isAnyValueInvalid = inputValues.some((value) => !inputPattern.test(value)) // Check for invalid values

  // Validate input based on conditions
  if (inputValues.length === 0) {
    errorMessage.value = 'Please enter at least one class name.'
  } else if (isAnyValueTooShort && isAnyValueInvalid) {
    errorMessage.value = 'Invalid input! Please enter values containing only lowercase letters or numbers with a length greater than 3.'
  } else if (isAnyValueTooShort) {
    errorMessage.value = 'Invalid input! Please enter values with a length greater than 3.'
  } else if (isAnyValueInvalid) {
    errorMessage.value = 'Invalid input! Please enter values containing only lowercase letters or numbers.'
  } else {
    errorMessage.value = ''
  }

  isValid.value = errorMessage.value === '' // Set validity flag based on error message

  return isValid.value // Return validity flag
}

// Function to close the popup
const closePopup = () => {
  props.togglePopup(null) // Call function from props to toggle popup visibility
}
</script>


<template>
  <div id="AddClassPopup">
    <div id="popup-inner" class="flex-col space-y-5">
      <!-- Popup header with title and close button -->
      <div id="title" class="flex justify-between">
        <p>Add New Classes</p>
        <button class="popup-close" @click="closePopup"><IconClose /></button>
      </div>
      <!-- Input area for entering class names -->
      <div id="inputclass-box" class="flex-col">
        <p id="text-advice">Add a comma separated list of class names</p>
        <input
          v-model="inputData"
          type="text"
          placeholder="aaa,bbb,ccc"
          id="text-input"
          :class="{ 'valid-box': isValid, 'invalid-box': !isValid }"
        />
        <!-- Display error message if validation fails -->
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </div>
      <!-- Button area for submitting or canceling -->
      <div id="button-line" class="flex">
        <button @click="submitData" id="SaveButton">Save</button>
        <button @click="closePopup" id="CloseButton">Cancel</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
#AddClassPopup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* Bring the popup to the front */
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
#popup-inner {
  background-color: white;
  padding: 40px;
  width: 800px;
  border-radius: 16px;
  opacity: 1;
  transition: opacity 0.3s ease;
}
#title {
  font-weight: bold;
}
#text-advice {
  font-size: 14px;
  font-weight: 500;
  color: #7e7e7e;
  padding: 10px 0;
}
#text-input {
  width: 100%;
  height: 41px;
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #c8cdd0;
  transition: border-color 0.3s ease;
}
#SaveButton {
  width: 144px;
  height: 32px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #48a393;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  cursor: pointer;
}
#CloseButton {
  width: 72px;
  height: 32px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #fff1f1;
  border: 1px solid #e83550;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #e83550;
  margin-left: 20px;
  cursor: pointer;
}
.valid-box {
  border-color: green;
}
.invalid-box {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
