<template>
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.png" alt="logo" class="h-10 w-10" />
          <span class="text-xl font-bold">Hotel Booking</span>
        </div>
        <div class="flex flex-col space-y-4">
          <nuxt-link to="/" class="hover:text-gray-400">Home</nuxt-link>
          <nuxt-link to="/#hoteli" class="hover:text-gray-400">Book</nuxt-link>
          <nuxt-link to="/reviews" class="hover:text-gray-400">Reviews</nuxt-link>
          <nuxt-link to="/contact" class="hover:text-gray-400">Contact</nuxt-link>
        </div>
        <div class="text-left">
          <p>Contact Us:</p>
          <p>Email: info@hotelbooking.com</p>
          <p>Phone: +xxx xxx xxxx</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  