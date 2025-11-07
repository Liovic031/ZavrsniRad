<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
      
      <!-- Forma za kontakt -->
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Pošaljite poruku</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Ime</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div class="mb-4">
            <label for="message" class="block text-sm font-medium text-gray-700">Poruka</label>
            <textarea
              v-model="form.message"
              id="message"
              required
              rows="4"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Pošalji
          </button>
        </form>
      </div>

      <!-- Kontakt informacije -->
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Kontakt informacije</h2>
        <p class="mb-4 text-gray-700 text-center">
          Ako imate bilo kakva pitanja ili trebate dodatne informacije, slobodno nas kontaktirajte.
        </p>
        <div class="space-y-2 text-gray-700 text-center">
          <p><strong>Email:</strong> info@hotelbooking.com</p>
          <p><strong>Telefon:</strong> +031 789 1132</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
})

const submitForm = async () => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    const result = await response.json()

    if (!response.ok || result.error) {
      alert('Greška pri slanju poruke: ' + (result.error?.message || result.message))
      return
    }

    alert('Poruka uspješno poslana!')
    form.value.name = ''
    form.value.email = ''
    form.value.message = ''
  } catch (err) {
    alert('Greška pri slanju: ' + err.message)
  }
}
</script>
