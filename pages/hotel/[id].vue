<template> 
  <div class="container mx-auto py-12">
    <div class="bg-gray-100 rounded-lg shadow-md overflow-hidden p-4 flex flex-col lg:flex-row">
      <!-- LEFT SIDE: IMAGE GALLERY -->
      <div class="w-full lg:w-1/2">
        <div class="relative cursor-pointer" @click="openGallery">
          <img :src="currentImage" alt="Hotel Image" class="w-full h-96 object-cover rounded" />
        </div>
        <div class="flex justify-center gap-2 mt-4">
          <img
            v-for="(img, index) in hotel.images"
            :key="index"
            :src="img"
            :class="[ 'w-24 h-16 object-cover cursor-pointer rounded', index === currentImageIndex ? 'opacity-100 border-2 border-gray-800' : 'opacity-60' ]"
            @click.stop="setImage(index)"
          />
        </div>
      </div>

      <!-- RIGHT SIDE: HOTEL INFO & BOOKING -->
      <div class="w-full lg:w-1/2 p-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ hotel.name }}</h3>
        <p class="text-gray-600 mb-2">{{ hotel.location }}</p>
        <div class="text-gray-800 font-bold mb-4">
          <p v-for="(price, type) in roomPrices" :key="type">{{ type }} - {{ price }} €</p>
        </div>
        <p class="text-gray-700 mb-6">{{ hotel.description }}</p>

        <div class="space-y-4">
          <div>
            <label for="roomType">Tip sobe:</label>
            <select id="roomType" v-model="roomType" class="border rounded-lg p-2 w-full">
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div>
            <label for="checkin">Check-in:</label>
            <input type="date" id="checkin" v-model="checkinDate" class="border rounded-lg p-2 w-full" />
          </div>

          <div>
            <label for="checkout">Check-out:</label>
            <input type="date" id="checkout" v-model="checkoutDate" class="border rounded-lg p-2 w-full" />
          </div>
          <div v-if="userRole === 'admin' || userRole === 'receptionist'">
            <label for="userSelect">Rezerviraj za korisnika:</label>
            <select v-model="selectedUserId" id="userSelect" class="border rounded-lg p-2 w-full">
              <option value="">-- Odaberi korisnika --</option>
              <option v-for="u in users" :key="u.id" :value="u.id">
                {{ u.name || u.email }}
              </option>
            </select>
          </div>
          <button class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="bookHotel">Bookiraj</button>
        </div>
      </div>
    </div>

    <!-- REVIEWS SECTION -->
    <div class="mt-12 bg-white-100 p-6 rounded">
      <h2 class="text-2xl font-bold mb-8">Recenzije</h2>
      <div v-if="reviews.length > 0" class="space-y-6">
        <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <p class="text-xl font-semibold">{{ review.user_name }}</p>
            <p class="text-black-500">Ocjena: {{ review.rating }}</p>
          </div>
          <p class="text-gray-600 mb-2 italic">Komentar: {{ review.comment }}</p>
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">{{ hotel.name }}</p>
            <p class="text-sm text-gray-500">{{ new Date(review.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-600">
        <p>Nema dostupnih recenzija za ovaj hotel.</p>
      </div>
    </div>

    <!-- IMAGE GALLERY MODAL -->
    <div v-if="showGallery" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div class="relative max-w-4xl w-full">
        <button @click="closeGallery" class="absolute top-4 right-4 text-white text-2xl">×</button>
        <img :src="currentImage" class="w-full max-h-[90vh] object-contain rounded" />
        <button @click="prevImage" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-gray-800 px-3 py-2 rounded hover:bg-gray-900">←</button>
        <button @click="nextImage" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-gray-800 px-3 py-2 rounded hover:bg-gray-900">→</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, useFetch } from 'nuxt/app'

const route = useRoute()
const router = useRouter()
const hotelId = route.params.id
const user = useSupabaseUser()

const hotel = ref({})
const reviews = ref([])
const roomPrices = ref({})
const checkinDate = ref('')
const checkoutDate = ref('')
const roomType = ref('single')
const currentImageIndex = ref(0)
const showGallery = ref(false)
const userRole = ref(null)
const users = ref([])
const selectedUserId = ref('')

const currentImage = computed(() => hotel.value.images?.[currentImageIndex.value])

const openGallery = () => (showGallery.value = true)
const closeGallery = () => (showGallery.value = false)
const nextImage = () => currentImageIndex.value = (currentImageIndex.value + 1) % hotel.value.images.length
const prevImage = () => currentImageIndex.value = (currentImageIndex.value - 1 + hotel.value.images.length) % hotel.value.images.length
const setImage = (index) => currentImageIndex.value = index

const fetchHotel = async () => {
  const { data } = await useFetch('/api/hotel/fetch-hotel', {
    method: 'POST',
    body: { hotelId }
  })
  if (data.value?.success) {
    hotel.value = {
      ...data.value.hotel,
      images: loadImages(data.value.hotel.id)
    }
  }
}

const fetchReviews = async () => {
  const { data } = await useFetch('/api/hotel/fetch-reviews', {
    method: 'POST',
    body: { hotelId }
  })
  if (data.value?.success) {
    reviews.value = data.value.reviews
  }
}

const fetchRoomPrices = async () => {
  const { data } = await useFetch('/api/hotel/get-room-prices', {
    method: 'POST',
    body: { hotelId }
  })
  if (data.value?.success) {
    roomPrices.value = data.value.roomPrices
  }
}

const fetchUserRole = async () => {
  const { data } = await useFetch('/api/user-role', {
    method: 'POST',
    body: { userId: user.value.id }
  })
  if (data.value?.success) {
    userRole.value = data.value.role

    if (userRole.value === 'admin' || userRole.value === 'receptionist') {
      await fetchUsers()
    }
  }
}

const fetchUsers = async () => {
  const { data } = await useFetch('/api/admin/get-users')
  if (data.value?.success) {
    users.value = data.value.users
  }
}

const bookHotel = async () => {
  if (!user.value) {
    alert('Morate biti prijavljeni.')
    router.push('/login')
    return
  }

  if (!checkinDate.value || !checkoutDate.value || new Date(checkoutDate.value) <= new Date(checkinDate.value)) {
    alert('Unesite ispravne datume.')
    return
  }

  if ((userRole.value === 'admin' || userRole.value === 'receptionist') && !selectedUserId.value) {
    alert('Odaberite korisnika za kojeg želite napraviti rezervaciju.')
    return
  }

  const actualUserId = (userRole.value === 'admin' || userRole.value === 'receptionist')
    ? selectedUserId.value
    : user.value.id

  const { data } = await useFetch('/api/hotel/book-room', {
    method: 'POST',
    body: {
      hotelId,
      userId: actualUserId,
      roomType: roomType.value,
      checkinDate: checkinDate.value,
      checkoutDate: checkoutDate.value
    }
  })

  if (data.value?.success) {
    alert(data.value.message)
    roomType.value = 'single'
    checkinDate.value = ''
    checkoutDate.value = ''
    selectedUserId.value = ''
  } else {
    alert(data.value?.message || 'Greška pri rezervaciji.')
  }
}


const loadImages = (id) => {
  switch (+id) {
    case 1: return [hotelOsijek1, hotelOsijek2, hotelOsijek3]
    case 2: return [waldinger1, waldinger2, waldinger3]
    case 3: return [sheraton1, sheraton2, sheraton3]
    case 4: return [esplanade1, esplanade2, esplanade3]
    case 5: return [ambasador1, ambasador2, ambasador3]
    case 6: return [hilton1, hilton2, hilton3]
    default: return []
  }
}

onMounted(async () => {
  await fetchHotel()
  await fetchReviews()
  await fetchRoomPrices()
  if (user.value) {
    await fetchUserRole()
  }
})

// IMAGES
import hotelOsijek1 from '@/assets/hotelosijek3.jpg'
import hotelOsijek2 from '@/assets/hotelosijek2.jpg'
import hotelOsijek3 from '@/assets/hotelosijek.webp'
import waldinger1 from '@/assets/waldinger.jpg'
import waldinger2 from '@/assets/waldinger2.jpg'
import waldinger3 from '@/assets/waldinger3.jpg'
import sheraton1 from '@/assets/sheraton.jpg'
import sheraton2 from '@/assets/sheraton2.jpg'
import sheraton3 from '@/assets/sheraton3.jpg'
import esplanade1 from '@/assets/esplanade.jpg'
import esplanade2 from '@/assets/esplanade2.jpg'
import esplanade3 from '@/assets/esplanade3.jpg'
import ambasador1 from '@/assets/ambasador.jpg'
import ambasador2 from '@/assets/ambasador2.jpg'
import ambasador3 from '@/assets/ambasador3.jpg'
import hilton1 from '@/assets/hilton.jpg'
import hilton2 from '@/assets/hilton2.jpg'
import hilton3 from '@/assets/hilton3.jpg'
</script>
