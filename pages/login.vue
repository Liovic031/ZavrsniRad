<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Prijava</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <input type="email" id="email" v-model="email" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 mb-2">Lozinka</label>
          <input type="password" id="password" v-model="password" class="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <button type="submit" class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900">Prijavi se</button>
      </form>
      <p class="mt-4 text-center">
        Nemate račun? <router-link to="/register" class="text-gray-800 hover:underline">Registrirajte se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>


const email = ref('')
const password = ref('')
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  
  if (error) {
    alert('Greška pri prijavi: ' + error.message)
  } else {
    alert('Uspješno prijavljeni')
    router.push('/')
  }
}
</script>
