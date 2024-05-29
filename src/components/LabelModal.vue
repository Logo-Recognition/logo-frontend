<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '@/config.js'
import axios from 'axios'

const emit = defineEmits(['close', 'submit'])
const boxName = ref('')
const classList = ref([])
const selectedClass = ref(null)

const fetchClassList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/class`, { method: 'GET' })
    classList.value = response.data
  } catch (error) {
    console.error('Error fetching class list:', error)
  }
}

const submitBoxName = () => {
  if (selectedClass.value) {
    emit('submit', { boxName: boxName.value, className: selectedClass.value })
    boxName.value = ''
    selectedClass.value = null
  } else {
    alert('Please select a class for the box.')
  }
}

const cancelBoxDrawing = () => {
  boxName.value = ''
  selectedClass.value = null
  emit('close', true)
}

const selectClass = (className) => {
  selectedClass.value = className
}

onMounted(() => {
  fetchClassList()
})
</script>

<template>
  <div class="modal" @click.self="cancelBoxDrawing">
    <div class="modal-content" @click.stop>
      <div class="class-list">
        <label class="label">Select Class:</label>
        <div
          class="class-item"
          v-for="classItem in classList"
          :key="classItem.id"
          @click="selectClass(classItem.name)"
          :class="{ selected: selectedClass.value === classItem.name }"
        >
          {{ classItem.name }}
        </div>
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

.class-list {
  margin-bottom: 20px;
}

.class-item {
  padding: 8px;
  border: 1px solid grey;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 4px;
}

.class-item.selected {
  background-color: #42b983;
  color: white;
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
  margin-right: 5px;
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
  border-radius: 4px;
  padding: 5px;
}
</style>
