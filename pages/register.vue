<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Registracija</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 mb-2">Ime</label>
          <input type="text" id="name" v-model="name" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <input type="email" id="email" v-model="email" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 mb-2">Lozinka</label>
          <input type="password" id="password" v-model="password" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block text-gray-700 mb-2">Potvrdi lozinku</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <button type="submit" class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" :disabled="loading">
          <span v-if="loading">Registracija...</span>
          <span v-else>Registriraj se</span>
        </button>
        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      </form>
      <p class="mt-4 text-center">
        Već imate račun? <nuxt-link to="/login" class="text-gray-800 hover:underline">Prijavite se</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const register = async () => {
  errorMessage.value = ''
  loading.value = true

  const { data, error } = await useFetch('/api/auth/register', {
    method: 'POST',
    body: {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    }
  })

  if (error.value || !data.value?.success) {
    errorMessage.value = data.value?.error?.message || error.value?.message || 'Neuspjela registracija'
  } else {
    alert('Uspješno registrirani')
    router.push('/')
  }

  loading.value = false
}
</script>
