<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-center mb-8">Ocijeni hotel</h1>
    
    <form @submit.prevent="submitReview" v-if="isLoggedIn" class="bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto">
      <div class="mb-4">
        <label for="hotel" class="block text-gray-700 mb-2">Hotel</label>
        <select id="hotel" v-model="selectedHotelId" class="w-full px-3 py-2 border rounded-lg">
          <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
            {{ hotel.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="rating" class="block text-gray-700 mb-2">Ocjena (1-5)</label>
        <input type="number" id="rating" v-model="rating" class="w-full px-3 py-2 border rounded-lg" min="1" max="5" required />
      </div>

      <div class="mb-4">
        <label for="comment" class="block text-gray-700 mb-2">Komentar</label>
        <textarea id="comment" v-model="comment" class="w-full px-3 py-2 border rounded-lg" required></textarea>
      </div>

      <button type="submit" class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900">
        Pošalji
      </button>
    </form>

    <div v-else class="text-center">
      <p class="text-gray-700">Molimo prijavite se kako biste ostavili recenziju.</p>
      <nuxt-link to="/login" class="text-blue-500 hover:underline">Prijavite se</nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = useSupabaseUser()
const isLoggedIn = ref(false)

const hotels = ref([])
const selectedHotelId = ref(null)
const rating = ref(1)
const comment = ref('')

const fetchHotels = async () => {
  const { data, error } = await useFetch('/api/hotels')

  if (error.value || !data.value?.success) {
    console.error('Greška pri dohvaćanju hotela:', error.value || data.value?.error)
    return
  }

  hotels.value = data.value.hotels
}

const submitReview = async () => {
  if (!user.value) {
    alert('Morate biti prijavljeni kako biste poslali recenziju.')
    return
  }

  const payload = {
    hotelId: selectedHotelId.value,
    userId: user.value.id,
    rating: rating.value,
    comment: comment.value
  }

  const { data, error } = await useFetch('/api/submit-reviews', {
    method: 'POST',
    body: payload
  })

  if (error.value || !data.value?.success) {
    alert('Greška pri slanju recenzije: ' + (data.value?.error?.message || error.value?.message))
    return
  }

  alert('Recenzija uspješno poslana!')
  selectedHotelId.value = null
  rating.value = 1
  comment.value = ''
}

onMounted(() => {
  isLoggedIn.value = !!user.value
  if (isLoggedIn.value) {
    fetchHotels()
  }
})
</script>
