<template>
  <nav class="bg-gray-800 w-full">
    <div class="container mx-auto p-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <img src="@/assets/logo.png" alt="logo" class="h-10 w-10" />
        <span class="text-white text-xl font-bold">Hotel Booking</span>
      </div>
      <div class="hidden md:flex flex-1 justify-center space-x-4">
        <nuxt-link to="/" class="text-white hover:text-gray-400">Home</nuxt-link>
        <nuxt-link to="/#hoteli" class="text-white hover:text-gray-400">Book</nuxt-link>
        <nuxt-link to="/reviews" class="text-white hover:text-gray-400">Reviews</nuxt-link>
        <nuxt-link to="/contact" class="text-white hover:text-gray-400">Contact</nuxt-link>

        <template v-if="user">
          <nuxt-link v-if="userRole === 'admin'" to="/admin" class="text-white hover:text-gray-400">Admin</nuxt-link>
          <nuxt-link v-if="userRole === 'receptionist'" to="/receptionist" class="text-white hover:text-gray-400">Reception</nuxt-link>
          <nuxt-link to="/my-reservations" class="text-white hover:text-gray-400">My Profile</nuxt-link>
        </template>
      </div>
      <div class="hidden md:flex space-x-4">
        <template v-if="user">
          <span class="text-white">Dobrodošao, {{ userName }}</span>
          <button @click="logout" class="text-white hover:text-gray-400">Odjavi se</button>
        </template>
        <template v-else>
          <nuxt-link to="/login" class="text-white hover:text-gray-400">Login</nuxt-link>
          <nuxt-link to="/register" class="text-white hover:text-gray-400">Register</nuxt-link>
        </template>
      </div>
      <button class="md:hidden text-white focus:outline-none" @click="isMenuOpen = !isMenuOpen">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div v-if="isMenuOpen" class="md:hidden bg-gray-800">
      <div class="flex flex-col items-center space-y-4 py-4">
        <nuxt-link to="/" class="text-white hover:text-gray-400">Home</nuxt-link>
        <nuxt-link to="/#hoteli" class="text-white hover:text-gray-400">Book</nuxt-link>
        <nuxt-link to="/reviews" class="text-white hover:text-gray-400">Reviews</nuxt-link>
        <nuxt-link to="/contact" class="text-white hover:text-gray-400">Contact</nuxt-link>

        <template v-if="user">
          <nuxt-link v-if="userRole === 'admin'" to="/admin" class="text-white hover:text-gray-400">Admin</nuxt-link>
          <nuxt-link v-if="userRole === 'receptionist'" to="/receptionist" class="text-white hover:text-gray-400">Reception</nuxt-link>
          <nuxt-link to="/my-reservations" class="text-white hover:text-gray-400">My Profile</nuxt-link>
          <button @click="logout" class="text-white hover:text-gray-400">Odjavi se</button>
        </template>

        <template v-else>
          <nuxt-link to="/login" class="text-white hover:text-gray-400">Login</nuxt-link>
          <nuxt-link to="/register" class="text-white hover:text-gray-400">Register</nuxt-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'nuxt/app'

const router = useRouter()
const user = useSupabaseUser()

const userRole = ref(null)
const isMenuOpen = ref(false)
const userName = computed(() => user.value?.user_metadata?.name || 'Korisnik')

const logout = async () => {
  const supabase = useSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert('Greška pri odjavi: ' + error.message)
  } else {
    userRole.value = null
    router.push('/login')
  }
}

watchEffect(async () => {
  if (user.value?.id) {
    const { data, error } = await useFetch('/api/user-role', {
      method: 'POST',
      body: { userId: user.value.id },
    })

    if (error.value || !data.value?.success) {
      console.error('Greška pri dohvaćanju role:', error.value || data.value?.error)
    } else {
      userRole.value = data.value.role
    }
  } else {
    userRole.value = null
  }
})
</script>
