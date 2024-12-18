<script setup></script>

<template>
    <div class="overview-page">
      <h1>Project Overview</h1>
      <div class="overview-cards">
      </div>
    </div>
  </template>
  
  <style scoped>
  .overview-page {
    padding: 20px;
    text-align: center;
  }
  
  .overview-cards {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    display: block;
    padding: 15px 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.3s ease;
  }
  
  .card:hover {
    background-color: #e0e0e0;
  }
  </style>
