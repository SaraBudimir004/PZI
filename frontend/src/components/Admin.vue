<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Admin Panel</h1>
    <button @click="logout" class="mb-4 p-2 bg-red-500 text-white rounded">Logout</button>

    <!-- KORISNICI -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Korisnici</h2>
      <table class="w-full border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-2">Username</th>
            <th class="p-2">Email</th>
            <th class="p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="border-b">
            <td class="p-2">{{ user.username }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">
              <button @click="deleteUser(user._id)" class="text-red-500">Obriši</button>
              <button @click="getPdfsByUser(user._id)" class="text-blue-500 ml-2">Prikaži PDF-ove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- PDF -->
    <section>
      <h2 class="text-xl font-semibold mb-4">PDF-ovi</h2>
      <table class="w-full border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-2">Naziv</th>
            <th class="p-2">Korisnik</th>
            <th class="p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pdf in pdfs" :key="pdf._id" class="border-b">
            <td class="p-2">{{ pdf.originalName || 'PDF' }}</td>
            <td class="p-2">{{ pdf.user?.username || 'Nepoznat korisnik' }}</td>
            <td class="p-2">
              <button @click="deletePdf(pdf._id)" class="text-red-500">Obriši</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const pdfs = ref([])
const token = localStorage.getItem('token')

onMounted(() => {
  getUsers()
  getAllPdfs()
})

const getUsers = async () => {
  try {
    const res = await axios.get('http://localhost:5000/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const getAllPdfs = async () => {
  try {
    const res = await axios.get('http://localhost:5000/admin/pdfs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    pdfs.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const getPdfsByUser = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/admin/pdfs/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    pdfs.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Jeste li sigurni da želite obrisati korisnika?')) return
  try {
    await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    getUsers()
    getAllPdfs()
  } catch (err) {
    console.error(err)
  }
}

const deletePdf = async (pdfId) => {
  if (!confirm('Jeste li sigurni da želite obrisati PDF?')) return
  try {
    await axios.delete(`http://localhost:5000/admin/pdfs/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    getAllPdfs()
  } catch (err) {
    console.error(err)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  window.location.href = '/'
}
</script>
