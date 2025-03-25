<script setup>
import IconClasses from '@/assets/icons/IconClasses.vue'
import IconUploadImage from '@/assets/icons/IconUploadImage.vue'
import IconAnnotate from '@/assets/icons/IconAnnotate.vue'
import IconAugment from '@/assets/icons/IconAugment.vue'
import IconDataset from '@/assets/icons/IconDataset.vue'
import IconModelRun from '@/assets/icons/IconModelRun.vue'
const emit = defineEmits(['openModal'])

const openModal = () => {
  emit('openModal')
}
</script>

<template>
  <aside class="sidebar">
    <div class="flex flex-col">
      <div id="title">
        <img alt="Logo project" class="logo" src="@/assets/images/logo.svg" width="100" />
      </div>
      <hr />
      <div id="menu" class="flex flex-col items-center p-6">
        <button @click="openModal" id="upload-img-button">
          <IconUploadImage />
          <span id="upload-img-text" class="p-1 text-light text-xs">Upload Image</span>
        </button>
        <div id="logo-management" class="w-full flex flex-col justify-start">
          <span class="menu-title">LOGO MANAGEMENT</span>
          <router-link to="/class" class="button">
            <IconClasses />
            <span class="text">Classes</span>
          </router-link>
          <router-link to="/annotate" class="button">
            <IconAnnotate />
            <span class="text">Annotate</span>
          </router-link>
          <router-link to="/augment" class="button">
            <IconAugment />
            <span class="text">Augmentation</span>
          </router-link>
          <router-link to="/dataset" class="button">
            <IconDataset />
            <span class="text">Dataset</span>
          </router-link>
        </div>
        <div id="models" class="w-full flex flex-col justify-start pt-6">
          <span class="menu-title">LOGO PREDICTION</span>
          <router-link to="/model" class="button">
            <IconModelRun />
            <span class="text">Run</span>
          </router-link>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 240px;
  border-right: 1px solid #d9d9d9;
  background-color: #071b40;
}
#title {
  display: flex;
  height: 72px;
  background-color: #fafafa;
  padding-left: 24px;
}
.logo {
  width: 71px;
}
hr {
  border: none;
  border-top: 1px solid #d9d9d9;
  margin: 0;
}
#upload-img-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 8px;
  background-color: #00b500;
  text-decoration-color: #eff1ff;
}
#upload-img-button:hover {
  background-color: #00b500f0;
}

.menu-title {
  font-size: 10px;
  color: #abadab;
}
.button {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background-color: #071b40;
  color: #d8dbd8;
  border-radius: 8px;
  margin-top: 8px;
  padding-left: 12px;
}
.button:hover {
  background-color: #f0f0f0;
  color: #071b40;
}
.text {
  padding-left: 12px;
}
.router-link-active {
  background-color: #eff1ff;
  color: #071b40;
}
</style>
