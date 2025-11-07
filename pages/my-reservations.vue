<template>
  <div class="container mx-auto py-12">
    <!-- VAŠ PROFIL -->
    <h2 class="text-2xl font-bold text-center mb-6">Vaš profil</h2>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Profilna slika"
        class="w-20 h-20 rounded-full mx-auto mb-4"
      />
      <h2 class="text-lg font-bold" v-if="userInfo">{{ userInfo.name }}</h2>
      <p class="text-gray-600" v-if="userInfo">{{ userInfo.email }}</p>
    </div>

    <!-- REZERVACIJE -->
    <h1 class="text-2xl font-bold mb-4 text-center">Vaše Rezervacije</h1>
    <div v-if="reservations.length">
      <div
        v-for="reservation in reservations"
        :key="reservation.id"
        class="bg-white p-4 rounded-lg shadow-md mb-4 max-w-2xl mx-auto"
      >
        <p><strong>Hotel:</strong> {{ reservation.hotels.name }}</p>
        <p><strong>Broj sobe:</strong> {{ reservation.rooms.room_number }}</p>
        <p><strong>Check-in:</strong> {{ reservation.check_in_date }}</p>
        <p><strong>Check-out:</strong> {{ reservation.check_out_date }}</p>
        <p><strong>Cijena:</strong> {{ reservation.total_price }} €</p>
        <p><strong>Status:</strong> {{ reservation.status || 'Na čekanju' }}</p>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      <p>Nemate nijednu rezervaciju.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'

const user = useSupabaseUser()
const router = useRouter()

const reservations = ref([])
const userInfo = ref(null)

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  try {
    const { data, error } = await useFetch('/api/user-reservations', {
      method: 'POST',
      body: { userId: user.value.id }
    })

    if (error.value || !data.value.success) {
      console.error('Greška pri dohvaćanju podataka:', error.value || data.value.error)
      return
    }

    userInfo.value = data.value.user
    reservations.value = data.value.reservations
  } catch (err) {
    console.error('Greška:', err)
  }
})
</script>
