<template>
  <div class="grid justify-items-stretch">
    <div class="flex justify-self-center justify-around w-3/4 items-center">
      <!-- Checkbox for "None" option -->
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="none"
          value="none"
          :checked="props.value === 'none'"
          @change="onCheckboxChange($event)"
        />
        <label for="none">None</label>
      </div>

      <!-- Checkbox for "Vertical" option -->
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="Vertical"
          value="Vertical"
          :checked="props.value === 'Vertical'"
          @change="onCheckboxChange($event)"
        />
        <label for="Vertical">Vertical</label>
      </div>

      <!-- Checkbox for "Horizontal" option -->
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="Horizontal"
          value="Horizontal"
          :checked="props.value === 'Horizontal'"
          @change="onCheckboxChange($event)"
        />
        <label for="Horizontal">Horizontal</label>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, defineProps, defineEmits } from 'vue'

// Define props received from parent component
const props = defineProps({
  value: String
});

// Define emitted event for parent component communication
const emit = defineEmits(['update:checkedName'])

// Reactive reference to store the currently checked checkbox value
const checkedName = ref(props.value)

// Function to handle checkbox change events
const onCheckboxChange = (event) => {
  checkedName.value = event.target.value
  emit('update:checkedName', checkedName.value)
}
</script>


<style scoped>
.flex {
  display: flex;
  /* gap: 10px; */
}

.custom-checkbox {
  display: flex;
  align-items: center;
  margin-top: 15px ;
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
