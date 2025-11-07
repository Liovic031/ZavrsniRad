<template>
  <div class="container mx-auto py-12" v-if="!loading">
    <div v-if="userRole === 'receptionist'">
      <div>
        <h1 class="text-2xl font-bold mb-4 cursor-pointer flex items-center" @click="toggleSection('reservations')">
          <span>Rezervacije za moj hotel</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200"
               :class="{ 'rotate-90': sections.reservations }" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7" />
          </svg>
        </h1>

        <div v-if="sections.reservations">
          <div v-if="reservations.length">
            <div v-for="(resGroup, label) in categorizedReservations" :key="label" class="mb-8">
              <h2 class="text-xl font-semibold mb-2">{{ label }}</h2>
              <div v-if="resGroup.length">
                <div v-for="r in resGroup" :key="r.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
                  <p><strong>Korisnik:</strong> {{ r.users?.name || 'Nepoznat' }}</p>
                  <p><strong>Broj sobe:</strong> {{ r.rooms?.room_number || 'Nepoznato' }}</p>
                  <p><strong>Check-in:</strong> {{ r.check_in_date }}</p>
                  <p><strong>Check-out:</strong> {{ r.check_out_date }}</p>
                  <p><strong>Cijena:</strong> {{ r.total_price }} €</p>
                  <p><strong>Status:</strong> {{ r.status || 'Na čekanju' }}</p>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <!-- Gumbi "Prihvati" i "Odbij" lijevo -->
                    <button v-if="!r.status || r.status === 'pending'" @click="updateStatus(r, 'accepted')"
                            class="bg-green-500 text-white px-4 py-2 rounded">
                      Prihvati
                    </button>
                    <button v-if="!r.status || r.status === 'pending' || r.status === 'accepted'" @click="updateStatus(r, 'rejected')"
                            class="bg-red-500 text-white px-4 py-2 rounded">
                      Odbij
                    </button>
                    <button v-if="r.status === 'rejected'" @click="updateStatus(r, 'accepted')"
                            class="bg-green-500 text-white px-4 py-2 rounded">
                      Prihvati
                    </button>
                    <div class="ml-auto flex gap-2">
                      <button @click="openEditModal(r)"
                              class="bg-yellow-500 text-white px-4 py-2 rounded">
                        Uredi datume
                      </button>
                      <button @click="deleteReservation(r.id)"
                              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Obriši
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else>Nema {{ label.toLowerCase() }} rezervacija.</p>
            </div>
          </div>
          <p v-else>Nema rezervacija za prikaz.</p>
        </div>
      </div>

      <!-- Recenzije -->
      <div>
        <h1 class="text-2xl font-bold mt-12 mb-4 cursor-pointer flex items-center" @click="toggleSection('reviews')">
          <span>Recenzije hotela</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200"
               :class="{ 'rotate-90': sections.reviews }" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7" />
          </svg>
        </h1>
        <div v-if="sections.reviews">
          <div v-if="reviews.length">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Korisnik:</strong> {{ review.users?.name || 'Nepoznat' }}</p>
              <p><strong>Ocjena:</strong> {{ review.rating }}</p>
              <p><strong>Komentar:</strong> {{ review.comment }}</p>
              <p><strong>Vrijeme:</strong> {{ new Date(review.created_at).toLocaleString() }}</p>
            </div>
          </div>
          <p v-else>Nema recenzija za prikaz.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal za uređivanje datuma -->
  <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Uredi datume</h2>
      <label class="block mb-2 font-semibold">Novi check-in datum:</label>
      <input v-model="newCheckIn" type="date" class="w-full border p-2 mb-4 rounded" />
      <label class="block mb-2 font-semibold">Novi check-out datum:</label>
      <input v-model="newCheckOut" type="date" class="w-full border p-2 mb-4 rounded" />
      <div class="flex justify-end gap-2">
        <button @click="closeEditModal" class="bg-gray-400 text-white px-4 py-2 rounded">Odustani</button>
        <button @click="saveUpdatedDates" class="bg-blue-500 text-white px-4 py-2 rounded">Spremi</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useSupabaseUser, useAsyncData, useFetch } from '#imports'

const user = useSupabaseUser()
const router = useRouter()

const loading = ref(true)
const userRole = ref(null)
const reservations = ref([])
const reviews = ref([])

const showEditModal = ref(false)
const selectedReservation = ref(null)
const newCheckIn = ref('')
const newCheckOut = ref('')

const sections = ref({
  reservations: true,
  reviews: true
})

function toggleSection(name) {
  sections.value[name] = !sections.value[name]
}

const today = new Date()

const categorizedReservations = computed(() => {
  const past = []
  const current = []
  const future = []

  for (const r of reservations.value) {
    const checkIn = new Date(r.check_in_date)
    const checkOut = new Date(r.check_out_date)

    if (checkOut < today) {
      past.push(r)
    } else if (checkIn > today) {
      future.push(r)
    } else {
      current.push(r)
    }
  }

  return {
    'Prošle rezervacije': past,
    'Trenutne rezervacije': current,
    'Buduće rezervacije': future
  }
})

// AUTH
if (!user.value) {
  router.push('/login')
} else {
  const { data: roleData } = await useAsyncData('receptionist-role', () =>
    $fetch('/api/user-role', {
      method: 'POST',
      body: { userId: user.value?.id }
    })
  )

  if (!roleData.value || roleData.value.role !== 'receptionist') {
    router.push('/')
  } else {
    userRole.value = roleData.value.role

    const { data } = await useAsyncData('receptionist-data', () =>
      $fetch('/api/receptionist/receptionist-data', {
        method: 'POST',
        body: { userId: user.value.id }
      })
    )

    if (data.value?.success) {
      reservations.value = data.value.reservations
      reviews.value = data.value.reviews
    }

    loading.value = false
  }
}

// FUNKCIJE
const updateStatus = async (reservation, status) => {
  const { data } = await useFetch('/api/admin/update-status', {
    method: 'POST',
    body: { reservationId: reservation.id, status }
  })
  if (data.value?.success) reservation.status = status
}

const deleteReservation = async (id) => {
  const { data } = await useFetch('/api/admin/delete-reservation', {
    method: 'POST',
    body: { reservationId: id }
  })
  if (data.value?.success) {
    reservations.value = reservations.value.filter(r => r.id !== id)
    alert('Rezervacija obrisana.')
  }
}

const openEditModal = (reservation) => {
  selectedReservation.value = reservation
  newCheckIn.value = reservation.check_in_date
  newCheckOut.value = reservation.check_out_date
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedReservation.value = null
}

const saveUpdatedDates = async () => {
  if (!newCheckIn.value || !newCheckOut.value) {
    alert('Unesite oba datuma.')
    return
  }

  const checkInDate = new Date(newCheckIn.value)
  const checkOutDate = new Date(newCheckOut.value)

  if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
    alert('Provjerite ispravnost datuma.')
    return
  }

  const { data } = await useFetch('/api/receptionist/update-dates', {
    method: 'POST',
    body: {
      reservationId: selectedReservation.value.id,
      newCheckIn: newCheckIn.value,
      newCheckOut: newCheckOut.value
    }
  })

  if (data.value?.success) {
    selectedReservation.value.check_in_date = newCheckIn.value
    selectedReservation.value.check_out_date = newCheckOut.value
    selectedReservation.value.total_price = data.value.newTotalPrice
    closeEditModal()
    alert('Datumi su ažurirani.')
  } else {
    alert(data.value?.message || 'Greška pri ažuriranju datuma.')
  }
}
</script>
