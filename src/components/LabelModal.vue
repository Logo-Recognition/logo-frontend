<script setup>
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import { API_URL } from '@/config.js'
import IconSearch from '@/components/icons/IconSearch.vue'

const props = defineProps({
  lastUsedClass: {
    type: String,
    default: ''
  }
})

const classList = ref([])
const filteredClassList = ref([])
const search = ref('')
const selectedClass = ref(props.lastUsedClass)
const emit = defineEmits(['close', 'submit', 'classSelected'])


const fetchClassList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/class`)
    classList.value = response.data.classes
    filteredClassList.value = classList.value
  } catch (error) {
    console.error('Error fetching class list:', error)
  }
}

const selectClass = (className) => {
  selectedClass.value = className
  emit('classSelected', className)

  console.log('Selected Class:', selectedClass.value)
}

const handleSubmit = () => {
  if (selectedClass.value) {
    toast.success('Class added successfully!', {
      autoClose: 3000
    })
    emit('classSelected', selectedClass.value)
    emit('submit', selectedClass.value)
  } else {
    toast.warning('Please select a class first', {
      autoClose: 3000
    })
    console.log('Please select a class first.')
  }
}

const cancelBoxDrawing = () => {
  selectedClass.value = ''
  emit('close')
}

const filterClasses = () => {
  if (search.value) {
    filteredClassList.value = classList.value.filter((classItem) =>
      classItem.toLowerCase().includes(search.value.toLowerCase())
    )
  } else {
    filteredClassList.value = classList.value
  }
}

onMounted(() => {
  fetchClassList()
  if (props.lastUsedClass) {
    selectedClass.value = props.lastUsedClass
    emit('classSelected', props.lastUsedClass)
  }
})

watch(search, filterClasses)
</script>

<template>
  <div class="modal" @click.self="cancelBoxDrawing">
    <div class="modal-wrapper bg-white">
      <div class="modal-container">
        <div class="modal-header bg-primary text-white">Label Image</div>
        <div class="modal-body">
          <div class="search-wrapper">
            <IconSearch class="search-icon" />
            <input type="text" v-model="search" placeholder="Search classes" class="search-input" />
            <i class="fas fa-search search-icon"></i>
          </div>
          <ul>
            <li v-for="(classItem, index) in filteredClassList" :key="index">
              <button
                class="class-item"
                :class="{ selected: classItem === selectedClass }"
                @click="selectClass(classItem)"
              >
                {{ classItem }}
              </button>
              <div class="divider" v-if="index !== classList.length - 1"></div>
            </li>
          </ul>
          <div class="item-error text-dark" v-if="!filteredClassList.length">
            <p>No class found</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="button is-success bg-secondary text-white hover:bg-primary"
            @click="handleSubmit"
          >
            Save
          </button>
          <button class="button is-danger" @click="cancelBoxDrawing">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  border-radius: 10px;
}

.modal-container {
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: start;
}

.modal-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 12px 20px;
}

.modal-body {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 12px 20px;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-45%);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
}

.search-input:focus {
  outline: 1px solid #7585ff;
  background-color: #eff1ff;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 16px;
}

.button {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  width: 100%;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.class-list {
  margin-bottom: 20px;
}

.class-list ul {
  padding: 0;
}

.class-item {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.class-item:hover {
  background-color: #eee;
}

.class-item.selected {
  background-color: #eff1ff;
  color: black;
}

.divider {
  border-bottom: 1px solid #e0e0e0;
}

.item-error {
  margin: 8px 16px;
}

.button.is-success {
  border-radius: 8px;
}

.button.is-success:hover {
  background-color: #6b7bf4;
}

.button.is-danger {
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid grey;
  color: grey;
}

.button.is-danger:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: grey;
}
</style>
