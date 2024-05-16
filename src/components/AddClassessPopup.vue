<template>
  <div id="AddClassPopup">
    <div id="popup-inner" class="flex-col space-y-5">
      <div id="title" class="flex flex justify-between">
        <p>Add New Classes</p>
        <button class="popup-close" @click="closePopup"><IconClose /></button>
      </div>
      <div id="inputclass-box" class="flex-col">
        <p id="text-advice">Add a comma seperated list of class name</p>
        <input v-model="inputData" type="text" placeholder="0,1,2" id="text-input" />
      </div>
      <div id="button-line" class="flex">
        <button @click="submitData" id="SaveButton">Save</button>
        <button @click="closePopup" id="CloseButton">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconClose from './icons/IconClose.vue'
import { defineProps, ref } from 'vue'

const props = defineProps({
  addClass: Function,
  togglePopup: Function
})
const inputData = ref('')

const submitData = () => {
  props.addClass(inputData.value)
  closePopup() // Optionally close the popup after submitting data
}

const closePopup = () => {
  // Close the popup
  props.togglePopup(null)
}
</script>

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
</style>
