<template>
    <div class="loader border-4 border-grey-background border-t-primary border-t-4"></div>
</template>
<style>
.loader {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>