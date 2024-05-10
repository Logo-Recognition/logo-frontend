<script setup>
  import { ref } from 'vue'
  
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
</script>

<template>
    <div v-if="props.isOpen" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2 class="text-xl font-semibold text-neutral-black ">Upload Image</h2>
            <div class="drop-area">
                <input class="file" type="file" multiple @change="onFileChange" accept="image/*" >
                <img alt="Upload image" class="m-5" src="@/assets/images/upload-btn.svg" width="90"/>
                <span class="text-primary font-normal text-sm">Click<span class="text-sub-primary"> hear </span>to upload or drop image</span>
            </div>
            <div v-if="previewImages" class="preview-area">
                <div v-for="(image, index) in previewImages" :key="index" class="preview-item">
                    <img class="preview-img" :src="image" />
                </div>
            </div>
        </div>
    </div>
</template>
  
<style>
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
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
  

  .drop-area{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    border-radius: 8.66px;
    border: 1px dashed #9E9E9E;
    margin: 20px;
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

  .preview-area{
    display: flex;
    padding-inline : 20px;
  }

  .preview-item{
    margin-right: 16px;
  }

  .preview-img{
    border-radius: 10px;
    width: 150px;
    height: 100px;
    object-fit: fill;
  }
</style>