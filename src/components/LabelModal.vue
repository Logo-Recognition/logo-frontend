<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])
const boxName = ref('')

const submitBoxName = () => {
  emit('submit', boxName.value)
  boxName.value = ''
}

const cancelBoxDrawing = () => {
  boxName.value = ''
  emit('close', true)
}
</script>

<template>
  <div class="modal" @click.self="cancelBoxDrawing">
    <div class="modal-content" @click.stop>
      <div class="box">
        <label class="label">Box Name:</label>
        <input class="input" type="text" v-model="boxName" autofocus />
      </div>
      <div class="buttons">
        <button class="button is-success" @click="submitBoxName">Submit</button>
        <button class="button is-danger" @click="cancelBoxDrawing">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.box {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 4px;
  border: 1px solid grey;
  border-radius: 4px;
  outline: none;
}

.input:focus {
  border-color: black;
}

.buttons {
  display: flex;
  justify-content: center;
}

.button.is-success {
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  padding: 5px;
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
  border-radius: 4px;
  padding: 5px;
}
</style>
