<script setup>
import IconClasses from '@/components/icons/IconClasses.vue'
import IconUploadImage from '@/components/icons/IconUploadImage.vue'
import IconAnnotate from './icons/IconAnnotate.vue';
import IconAugment from './icons/IconAugment.vue';
import IconDataset from './icons/IconDataset.vue';
import IconModelRun from './icons/IconModelRun.vue';
import IconLogout from './icons/IconLogout.vue';
import IconOCR from './icons/IconOCR.vue';
const emit = defineEmits(['openModal'])

const openModal = () => {
  emit('openModal')
}

</script>

<template>
    <aside class="sidebar">
        <div class="flex flex-col">
            <div id="title">
                <img alt="Logo project" class="logo" src="@/assets/images/logo.svg" width="100"/>
            </div>
            <hr>
            <div id="menu" class="flex flex-col items-center p-6">
                <button @click="openModal" id="upload-img-button" >
                    <IconUploadImage />
                    <span id="upload-img-text" class="p-1 text-neutral-white text-xs">Upload Image</span>
                </button>
                <div id="logo-management" class="w-full flex flex-col justify-start">
                    <span class="menu-title">LOGO MANAGEMENT</span>
                    <router-link to='/' class="button">
                        <IconClasses/>
                        <span class="text">Classes</span>
                    </router-link>
                    <router-link to='/annotate' class="button">
                        <IconAnnotate/>
                        <span class="text">Annotate</span>
                    </router-link>
                    <router-link to='/augment' class="button">
                        <IconAugment/>
                        <span class="text">Augmentation</span>
                    </router-link>
                    <router-link to='/dataset' class="button">
                        <IconDataset/>
                        <span class="text">Dataset</span>
                    </router-link>
                </div>
                <div id="models" class="w-full flex flex-col justify-start pt-6">
                    <span class="menu-title">MODELS</span>
                    <router-link to='/model' class="button">
                        <IconModelRun/>
                        <span class="text">Run</span>
                    </router-link>
                </div>
                <div id="text-convert" class="w-full flex flex-col justify-start pt-6">
                    <span class="menu-title">TEXT CONVERT</span>
                    <router-link to='/text-convert' class="button">
                        <IconOCR/>
                        <span class="text">OCR</span>
                    </router-link>
                </div>
            </div>
        </div>
        
        <div id="user-card" class="flex flex-row h-24 items-center border-t border-light-accent p-6">
            <div id="user-avatar" class="w-10 h-10 bg-primary rounded-full"></div>
            <div class="flex flex-col justify-center px-4">
                <span class="text-sm text-primary-dark font-medium">Deko Ahmed</span>
                <span class="text-xs text-neutral-dark-grey font-normal">38deko@gmail.com</span>
            </div>
            <button>
                <IconLogout/>
            </button>
        </div>
    </aside>
</template>

<style scoped>
.sidebar{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 256px;
    height: 100vh;
    border-right: 1px solid #D9D9D9;
    background-color: #FEFEFE
}
#title{
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
#upload-img-button{
    display: flex;
    align-items: center; 
    justify-content:center; 
    width: 100%;
    height: 40px;
    margin-bottom: 24px;
    border: none;
    border-radius: 8px;
    background-color: #0D4F72;
    text-decoration-color: #FEFEFE;
}
#upload-img-button:hover{
    background-color: #003045;
}

.menu-title{
    font-size: 10px;
    color: #5C5E64;
}
.button{
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center; 
    justify-content:start; 
    background-color: #FEFEFE;
    color : #7E7E7E;
    border-radius: 8px;
    margin-top: 8px;
    padding-left: 12px;
    
}
.button:hover {
    background-color: #F0F0F0;
    color: #0D4F72;
}
.text{
    padding-left: 12px
}
.router-link-active {
  background-color: #F0F0F0;
  color: #0D4F72;
}

</style>