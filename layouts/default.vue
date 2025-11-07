<template>
    <div>
      <Navbar />
      <div class="min-h-screen">
        <slot />
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/Navbar/index.vue'
  import Footer from '@/components/Footer/index.vue'
  </script>
  