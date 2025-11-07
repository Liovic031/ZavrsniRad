<template>
    <div>
      <div class="relative h-96">
        <img src="@/assets/banner.jpg" alt="Banner" class="object-cover w-full h-full" />
        <div class="absolute inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center">
          <h1 class="text-white text-4xl md:text-6xl font-bold mb-6">
            Dobrodošli na stranicu Hotel Booking
          </h1>
          <div class="w-full max-w-xl flex bg-white rounded-full shadow overflow-hidden">
            <input
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              type="text"
              placeholder="Pretraži hotel po imenu..."
              class="flex-grow px-6 py-3 rounded-l-full focus:outline-none text-gray-700 text-base"
            />
            <button
              @click="handleSearch"
              class="px-6 flex items-center justify-center bg-white text-white rounded-r-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section class="py-12 bg-slate-200">
        <h2 class="text-center text-3xl font-bold text-slate-800 mb-8">GRADOVI</h2>
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/osijek1.jpg" alt="Osijek" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Osijek</h3>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/zagreb1.jpg" alt="Zagreb" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Zagreb</h3>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/split1.jpeg" alt="Split" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Split</h3>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/rijeka1.jpg" alt="Rijeka" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Rijeka</h3>
            </div>
          </div>
        </div>
      </section>
      
      <section id="hoteli" class="py-12 bg-slate-200">
        <h2 class="text-center text-3xl font-bold text-slate-800 mb-8">HOTELI</h2>
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/hotelosijek3.jpg" alt="Hotel Osijek" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Hotel Osijek</h3>
              <p class="text-gray-600">Osijek, Hrvatska</p>
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(1)">Bookiraj</button>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/waldinger.jpg" alt="Hotel Waldinger" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Hotel Waldinger</h3>
              <p class="text-gray-600">Osijek, Hrvatska</p>             
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(2)">Bookiraj</button>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/sheraton.jpg" alt="Sheraton Zagreb Hotel" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Sheraton Zagreb Hotel</h3>
              <p class="text-gray-600">Zagreb, Hrvatska</p>
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(3)">Bookiraj</button>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/esplanade.jpg" alt="Esplanade Hotel" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Esplanade Hotel</h3>
              <p class="text-gray-600">Zagreb, Hrvatska</p>
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(4)">Bookiraj</button>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/ambasador.jpg" alt="Hotel Ambasador" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Hotel Ambasador</h3>
              <p class="text-gray-600">Split, Hrvatska</p>
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(5)">Bookiraj</button>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="@/assets/hilton.jpg" alt="Hotel Hilton" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">Hotel Hilton</h3>
              <p class="text-gray-600">Rijeka, Hrvatska</p>
              <button class="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900" @click="navigateToHotel(6)">Bookiraj</button>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const hotels = [
  { id: 1, name: 'Hotel Osijek' },
  { id: 2, name: 'Hotel Waldinger' },
  { id: 3, name: 'Sheraton Zagreb Hotel' },
  { id: 4, name: 'Esplanade Hotel' },
  { id: 5, name: 'Hotel Ambasador' },
  { id: 6, name: 'Hotel Hilton' }
]

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()
  const match = hotels.find(h => h.name.toLowerCase().includes(query))
  if (match) {
    router.push(`/hotel/${match.id}`)
  } else {
    alert('Hotel nije pronađen.')
  }
}

const navigateToHotel = (id) => {
  router.push(`/hotel/${id}`)
}
</script>
  