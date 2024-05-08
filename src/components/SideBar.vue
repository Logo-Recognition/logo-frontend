<script setup>
import IconClasses from '@/components/icons/IconClasses.vue'
import IconUploadImage from '@/components/icons/IconUploadImage.vue'
</script>

<template>
    <aside class="sidebar">
        <div class="title">
            <img alt="Logo project" class="logo" src="@/assets/images/logo.svg" width="100"/>
        </div>
        <hr>
        <button class="icon-button">
            <IconUploadImage/>
            <span id="upload-img-text">Upload Image</span>
        </button>
        <div class="menu">
            <router-link to='/' class="button">
                <IconClasses />
				<span class="text">Class</span>
            </router-link>
        </div>
    </aside>
</template>

<style scoped>
.sidebar{
    width: 256px;
    height: 100vh;
    border-right: 1px solid #D9D9D9;
    background-color: #FEFEFE
}
.title{
    display: flex;
    height: 72px;
    background-color: #FAFAFA;
    padding-left: 24px
}
.logo{
    width: 71px;
}
hr {
  border: none;
  border-top: 1px solid #D9D9D9;
  margin: 0;
}
.icon-button{
    display: flex;
    align-items: center; 
    justify-content:center; 
    margin: 24px;
    width: 80%;
    height: 40px;
    border: none;
    border-radius: 8px;
    background-color: #0D4F72;
    text-decoration-color: #FEFEFE;
}
</style>