<script setup>
import { ref } from 'vue'
import PreviewImage from './PreviewImage.vue';
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'file-selected'])

const previewImages = ref([])

const closeModal = () => {
  emit('close')
  previewImages.value = []
}

const onFileChange = (event) => {
  const files = event.target.files
  for (var index = 0; index < files.length; index++) {
      var reader = new FileReader();
      reader.onload = function(event) {
        const imageUrl = event.target.result;
        previewImages.value.push(imageUrl);
      }
      reader.readAsDataURL(files[index]);
  }
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}
</script>

<template>
    <div v-if="props.isOpen" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2 class="text-xl font-semibold text-neutral-black pb-6">Upload Image</h2>
            <div class="upload-content">
              <div class="drop-area">
                <input class="file" type="file" multiple @change="onFileChange" accept="image/*" >
                <img alt="Upload image" class="m-5" src="@/assets/images/upload-btn.svg" width="90"/>
                <span class="text-primary font-normal text-sm">Click<span class="text-sub-primary"> hear </span>to upload or drop image</span>
              </div>
              <div v-if="previewImages.length > 0" class="preview-container">
                <div v-if="previewImages" class="preview-area">
                    <div v-for="(image, index) in previewImages" :key="index" class="preview-items">
                        <PreviewImage :src="image" @img-removed="removeImage(index)"></PreviewImage>
                    </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row pt-5">
              <button class="save-button">Save</button>
              <button class="cancel-button">Cancel</button>
            </div>
        </div>
    </div>
</template>
  
<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding-inline: 46.5px;
  padding-block: 40px;
  width: 60%;
  border-radius: 16px;
}

.close {
  color: #111111;
  float: right;
  font-size: 20px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.upload-content{
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 1px 5px 0px #64748B1F;
  border-radius: 8px;

}

.drop-area{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: 8.66px;
  border: 1px dashed #9E9E9E;
  margin: 24px;
  position: relative;
}

.drop-area:hover{
  border: 1px dashed #0D4F72;
}

.file{
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.preview-container {
  overflow-x: auto;
  white-space: nowrap;
  margin-inline: 24px;
  margin-bottom: 24px;
}

.preview-area{
  display: inline-flex;
}

.preview-items{
  width: 150px;
  height: 100px;
  margin-right: 16px;
}

.save-button{
  width: 144px;
  height: 32px;
  border-radius: 8px;
  background-color: #48A393;
  color: #FEFEFE;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16px;
}

.cancel-button{
  width: 72px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #E83550;
  color: #E83550;
  background-color: #FFF1F1;
  font-size: 12px;
  font-weight: 600;
}
  
</style>