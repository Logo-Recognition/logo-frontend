<template>
  <div class="grid justify-items-stretch">
    <!-- <div>Checked name: {{ checkedName }}</div> -->
    <div class="flex justify-self-center justify-around w-3/4 items-center">
      <!-- Checkbox for "Pepper" -->
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="pepper"
          value="pepper"
          :checked="checkedName === 'pepper'"
          @change="onCheckboxChange($event)"
        />
        <label for="pepper">Pepper</label>
      </div>

      <!-- Checkbox for "Chromatic" -->
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="chromatic"
          value="chromatic"
          :checked="checkedName === 'chromatic'"
          @change="onCheckboxChange($event)"
        />
        <label for="chromatic">Chromatic</label>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, defineEmits } from 'vue'

// Reactive reference to store the currently checked checkbox value
const checkedName = ref('pepper')

// Define emitted event for parent component communication
const emit = defineEmits(['update:checkedName'])

// Function to handle checkbox change events
const onCheckboxChange = (event) => {
  if (event.target.checked) {
    checkedName.value = event.target.value
    emit('update:checkedName', checkedName.value)
  } else {
    // Prevent unchecking the currently checked checkbox
    event.target.checked = true
  }
}
</script>


<style scoped>
.flex {
  display: flex;
  gap: 10px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  margin-top: 5px ;
}

.custom-checkbox input[type='checkbox'] {
  width: 12px;
  height: 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fefefe;
  border: 1px solid #7e7e7e;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.custom-checkbox input[type='checkbox']:checked {
  background-color: #7585ff;
  border: 1px solid #7585ff;
}

/* Change the text color of the label when the checkbox is checked */
.custom-checkbox input[type='checkbox']:checked + label {
  color: #7585ff; /* Change this to the desired color */
}

.custom-checkbox label {
  margin-left: 8px;
  cursor: pointer;
  user-select: none;
}
label {
  color: #7E7E7E;
}
</style>
