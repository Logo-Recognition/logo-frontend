<script setup>
import IconClose from './icons/IconClose.vue'
import { defineProps, ref } from 'vue'
const pathPublic = 'http://192.168.2.44:5000/api/class'
const props = defineProps({
  fetchClasses: Function,
  togglePopup: Function
})

const inputData = ref('')
const isValid = ref(false)
const error = ref(null)
const errorMessage = ref('')

const submitData = () => {
  if (validateInput()) {
    addClass(inputData.value)
    closePopup() // Optionally close the popup after submitting data
  }
}

const addClass = (classNames) => {
  const newClasses = classNames
    .split(',') // Split the input string by commas
    .map((name) => name.trim()) // Trim leading/trailing spaces from each class name
    .filter((name) => name !== '') // Filter out empty strings and existing class names

  newClasses.forEach((ClassName) => PostClass(ClassName))
}

const PostClass = async (newClassName) => {
  try {
    const response = await fetch(pathPublic, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bucket_name: newClassName })
    })
    const data = await response.json()

    if (data.success) {
      // Fetch updated class list after successful addition
      props.fetchClasses(null)
    } else {
      error.value = data.error
    }
  } catch (err) {
    error.value = 'An error occurred while adding the new class.'
    console.error(err)
  }
}
// AddClassPopup implement zone

// Define the validation function
const validateInput = () => {
  const inputValues = inputData.value
    .split(',') // Split the input string by commas
    .map((name) => name.trim()) // Trim leading/trailing spaces from each class name
    .filter((name) => name !== '') // Filter out empty strings and existing class names

  const inputPattern = /^[a-z0-9]+$/
  const isAnyValueTooShort = inputValues.some((value) => value.length < 3)
  const isAnyValueInvalid = inputValues.some((value) => !inputPattern.test(value))

  if (isAnyValueTooShort && isAnyValueInvalid) {
    errorMessage.value =
      'Invalid input! Please enter values containing only lowercase letters or numbers with a length greater than 3.'
  } else if (isAnyValueTooShort) {
    errorMessage.value = 'Invalid input! Please enter values with a length greater than 3.'
  } else if (isAnyValueInvalid) {
    errorMessage.value =
      'Invalid input! Please enter values containing only lowercase letters or numbers.'
  } else {
    errorMessage.value = ''
  }

  isValid.value = !isAnyValueTooShort && !isAnyValueInvalid

  return isValid.value
}
const closePopup = () => {
  // Close the popup
  props.togglePopup(null)
}
</script>
<template>
  <div id="AddClassPopup">
    <div id="popup-inner" class="flex-col space-y-5">
      <div id="title" class="flex flex justify-between">
        <p>Add New Classes</p>
        <button class="popup-close" @click="closePopup"><IconClose /></button>
      </div>
      <div id="inputclass-box" class="flex-col">
        <p id="text-advice">Add a comma seperated list of class name</p>
        <input
          v-model="inputData"
          type="text"
          placeholder="aaa,bbb,ccc"
          id="text-input"
          :class="{ 'valid-box': isValid, 'invalid-box': !isValid }"
        />
        <p v-if="!isValid" class="error-message">
          {{ errorMessage }}
        </p>
      </div>
      <div id="button-line" class="flex">
        <button @click="submitData" id="SaveButton">Save</button>
        <button @click="closePopup" id="CloseButton">Cancel</button>
      </div>
    </div>
    <div class="flex flex-col">
      {{ isValid }}
      {{ inputData }}
      {{ inputData.length }}
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
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
}
#popup-inner {
  background-color: white;
  padding: 40px;
  width: 800px;
  height: 255px;
  border-radius: 16px;
  opacity: 0px;
}
#title {
  font-weight: bold;
}
#text-advice {
  font-size: 14px;
  font-weight: 500;
  color: #7e7e7e;
  padding-left: 0px !important;
  padding: 10px;
}
#text-input {
  width: 707px;
  height: 41px;
  padding: 12px 18px 12px 18px;
  gap: 8px;
  border-radius: 8px;
  border: 1px;
  opacity: 0px;
  border: 1px solid #c8cdd0;
}
#SaveButton {
  width: 144px;
  height: 32px;
  padding: 8px 16px 8px 16px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #48a393;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

#CloseButton {
  width: 72px;
  height: 32px;
  padding: 8px 16px 8px 16px;
  gap: 8px;
  border-radius: 8px;
  opacity: 0px;
  background: #fff1f1;
  border: 1px solid #e83550;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #e83550;
  margin-left: 20px;
}
.valid-box {
  border: 2px solid green;
}

/* Styles for invalid input */
.invalid-box {
  border: 2px solid red;
}

/* Styles for error message */
.error-message {
  color: red;
  font-size: 12px;
}
</style>
