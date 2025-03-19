<script setup></script>

<template>
  <div class="login-page flex items-center justify-center h-screen w-screen">
    <div class="login-box space-y-8">
      <div class="space-y-2">
        <h3>
          <span class="text-black">Welcome to </span>
          <span class="text-accent font-bold">LOGO</span>
        </h3>
        <h1 class="font-semibold">Sign in or Sign up</h1>
      </div>
      <button
        class="google-login bg-light text-secondary font-medium w-full hover:bg-hover hover:bg-opacity-20"
      >
        Continue with Google
      </button>
      <p class="text-grey-text">
        By clicking continue, you agree to our
        <a href="#" class="text-hover hover:underline">Terms of Service</a> and
        <a href="#" class="text-hover hover:underline">Privacy Policy</a>.
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: url('./src/assets/images/signin-bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

.login-box {
  background-color: white;
  border-radius: 16px;
  padding: 48px 72px;
  text-align: left;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.google-login {
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 0.8rem;
}
</style>
