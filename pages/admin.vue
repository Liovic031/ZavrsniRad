<template>
  <div class="container mx-auto py-12" v-if="!loading">
    <div v-if="userRole === 'admin'">
      <!-- REZERVACIJE -->
      <div>
        <h1 class="text-2xl font-bold mb-4 cursor-pointer flex items-center" @click="toggleSection('reservations')">
          <span>Sve Rezervacije</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200" :class="{ 'rotate-90': sections.reservations }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </h1>
        <div v-if="sections.reservations">
          <div v-if="reservations.length">
            <div v-for="reservation in reservations" :key="reservation.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Korisnik:</strong> {{ reservation.user_name }}</p>
              <p><strong>Hotel:</strong> {{ reservation.hotel_name }}</p>
              <p><strong>Broj sobe:</strong> {{ reservation.room_number }}</p>
              <p><strong>Check-in:</strong> {{ reservation.check_in_date }}</p>
              <p><strong>Check-out:</strong> {{ reservation.check_out_date }}</p>
              <p><strong>Cijena:</strong> {{ reservation.total_price }} €</p>
              <p><strong>Status:</strong> {{ reservation.status || 'Na čekaju' }}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <button v-if="!reservation.status || reservation.status === 'pending'" @click="updateStatus(reservation, 'accepted')" class="bg-green-500 text-white px-4 py-2 rounded">Prihvati</button>
                <button v-if="!reservation.status || reservation.status === 'pending' || reservation.status === 'accepted'" @click="updateStatus(reservation, 'rejected')" class="bg-red-500 text-white px-4 py-2 rounded">Odbij</button>
                <button v-if="reservation.status === 'rejected'" @click="updateStatus(reservation, 'accepted')" class="bg-green-500 text-white px-4 py-2 rounded">Prihvati</button>
                <button @click="deleteReservation(reservation.id)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-auto">Obriši</button>
              </div>
            </div>
          </div>
          <p v-else>Nema rezervacija za prikaz.</p>
        </div>
      </div>

      <!-- UPITI -->
      <div>
        <h1 class="text-2xl font-bold mt-12 mb-4 cursor-pointer flex items-center" @click="toggleSection('contacts')">
          <span>Upiti s Kontakt Forme</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200" :class="{ 'rotate-90': sections.contacts }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </h1>
        <div v-if="sections.contacts">
          <div v-if="contacts.length">
            <div v-for="contact in contacts" :key="contact.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Ime:</strong> {{ contact.name }}</p>
              <p><strong>Email:</strong> {{ contact.email }}</p>
              <p><strong>Poruka:</strong> {{ contact.message }}</p>
              <p><strong>Vrijeme:</strong> {{ new Date(contact.created_at).toLocaleString() }}</p>
              <div class="text-right mt-2">
                <button @click="deleteContact(contact.id)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Obriši</button>
              </div>
            </div>
          </div>
          <p v-else>Nema poruka za prikaz.</p>
        </div>
      </div>

      <!-- RECENZIJE -->
      <div>
        <h1 class="text-2xl font-bold mt-12 mb-4 cursor-pointer flex items-center" @click="toggleSection('reviews')">
          <span>Sve Recenzije</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200" :class="{ 'rotate-90': sections.reviews }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </h1>
        <div v-if="sections.reviews">
          <div v-if="reviews.length">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Korisnik:</strong> {{ review.user_name }}</p>
              <p><strong>Hotel:</strong> {{ review.hotel_name }}</p>
              <p><strong>Ocjena:</strong> {{ review.rating }}</p>
              <p><strong>Komentar:</strong> {{ review.comment }}</p>
              <p><strong>Vrijeme:</strong> {{ new Date(review.created_at).toLocaleString() }}</p>
              <div class="text-right mt-2">
                <button @click="deleteReview(review.id)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Obriši</button>
              </div>
            </div>
          </div>
          <p v-else>Nema recenzija za prikaz.</p>
        </div>
      </div>
      <!-- USERS -->
      <div>
        <h1 class="text-2xl font-bold mt-12 mb-4 cursor-pointer flex items-center" @click="toggleSection('users')">
          <span>Svi Korisnici</span>
          <svg class="w-5 h-5 ml-2 transform transition-transform duration-200" :class="{ 'rotate-90': sections.users }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </h1>
        <div v-if="sections.users">
          <div v-if="users.length">
            <div v-for="u in users" :key="u.id" class="bg-white p-4 rounded-lg shadow-md mb-4">
              <p><strong>Ime:</strong> {{ u.name }}</p>
              <p><strong>Email:</strong> {{ u.email }}</p>
              <p><strong>Kreiran:</strong> {{ new Date(u.created_at).toLocaleDateString() }}</p>
              <div class="text-right mt-2">
                <button @click="deleteUser(u.id)" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Obriši korisnika</button>
              </div>
          </div>
        </div>
        <p v-else>Nema korisnika za prikaz.</p>
      </div>
      </div>
    </div>  
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter, useSupabaseUser, useAsyncData, useFetch } from '#imports'

const user = useSupabaseUser()
const router = useRouter()

const loading = ref(true)
const userRole = ref(null)
const reservations = ref([])
const contacts = ref([])
const reviews = ref([])
const users = ref([])

const sections = ref({
  reservations: true,
  contacts: true,
  reviews: true,
  users: true
})

function toggleSection(name) {
  sections.value[name] = !sections.value[name]
}

// ROLE
const { data: roleData } = await useAsyncData('user-role', () =>
  $fetch('/api/user-role', {
    method: 'POST',
    body: { userId: user.value?.id }
  })
)

if (!user.value) {
  router.push('/login')
} else if (roleData.value?.role !== 'admin') {
  router.push('/')
} else {
  userRole.value = roleData.value.role

  // REZERVACIJE, RECENZIJE, KONTAKTI
  const { data: adminData } = await useAsyncData('admin-data', () =>
    $fetch('/api/admin/admin-data')
  )

  if (adminData.value?.success) {
    reservations.value = adminData.value.reservations.map(r => ({
      ...r,
      user_name: r.users?.name || 'Nepoznat korisnik',
      hotel_name: r.hotels?.name || 'Nepoznat hotel',
      room_number: r.rooms?.room_number || 'Nepoznato'
    }))
    reviews.value = adminData.value.reviews.map(r => ({
      ...r,
      user_name: r.users?.name || 'Nepoznat korisnik',
      hotel_name: r.hotels?.name || 'Nepoznat hotel'
    }))
    contacts.value = adminData.value.contacts
  }

  // USERS
  const { data: usersData } = await useAsyncData('users', () =>
    $fetch('/api/admin/get-users')
  )

  if (usersData.value?.success) {
    users.value = usersData.value.users
  }

  loading.value = false
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
  if (!confirm('Jeste li sigurni?')) return
  const { data } = await useFetch('/api/admin/delete-reservation', {
    method: 'POST',
    body: { reservationId: id }
  })
  if (data.value?.success) {
    reservations.value = reservations.value.filter(r => r.id !== id)
    alert('Rezervacija obrisana.')
  }
}

const deleteContact = async (id) => {
  const { data } = await useFetch('/api/admin/delete-contact', {
    method: 'POST',
    body: { contactId: id }
  })
  if (data.value?.success) contacts.value = contacts.value.filter(c => c.id !== id)
}

const deleteReview = async (id) => {
  const { data } = await useFetch('/api/admin/delete-review', {
    method: 'POST',
    body: { reviewId: id }
  })
  if (data.value?.success) reviews.value = reviews.value.filter(r => r.id !== id)
}

const deleteUser = async (userId) => {
  const { data } = await useFetch('/api/admin/delete-user', {
    method: 'POST',
    body: { userId }
  })
  if (data.value?.success) {
    users.value = users.value.filter(u => u.id !== userId)
    alert('Korisnik obrisan.')
  }
}
</script>


