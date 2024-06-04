<template>
  <div class="grid justify-items-stretch">
    <!-- <div>Checked name: {{ checkedName }}</div> -->
    <div class="flex justify-self-center justify-around w-3/4 items-center">
      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="none"
          value="none"
          :checked="checkedName === 'none'"
          @change="onCheckboxChange($event)"
        />
        <label for="none">None</label>
      </div>

      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="Vertical"
          value="Vertical"
          :checked="checkedName === 'Vertical'"
          @change="onCheckboxChange($event)"
        />
        <label for="Vertical">Vertical</label>
      </div>

      <div class="custom-checkbox">
        <input
          type="checkbox"
          id="Horizontal"
          value="Horizontal"
          :checked="checkedName === 'Horizontal'"
          @change="onCheckboxChange($event)"
        />
        <label for="Horizontal">Horizontal</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const checkedName = ref('none')
const emit = defineEmits(['update:checkedName'])

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
