<script setup>
  
const props = defineProps({
    src: {
        type: String,
        required: true,
    }
})

const emit = defineEmits(['img-removed',])

const removeImage = () => {
    emit("img-removed")
}

</script>

<template>
    <div class="preview-item">
        <img class="remove-btn" src="@/assets/images/remove-img-btn.svg" @click="removeImage"/>
        <img class="preview-img" :src=props.src />
    </div>
</template>

<style scoped>

.preview-item{
    position: relative;
}

.preview-img{
    border-radius: 10px;
    width: 150px;
    height: 100px;
    object-fit: fill;
}

.remove-btn{
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
}
</style>