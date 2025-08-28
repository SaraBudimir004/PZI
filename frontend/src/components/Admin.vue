<template>
  <div class="upload-container">
    <div class="upload-content admin-content">
      <!-- Naslov Admin panela -->
      <h1 class="admin-title">Admin Panel</h1>
      <button @click="logout" class="logout-btn">Odjava</button>

      <!-- KORISNICI -->
      <section class="users-section">
        <h2 class="section-title">Korisnici</h2>
        <table class="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Pregled PDF</th>
              <th>Brisanje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td data-label="Username">{{ user.username }}</td>
              <td data-label="Email">{{ user.email }}</td>
              <td data-label="Pregled PDF">
                <button @click="getPdfsByUser(user._id)" class="action-btn view-btn">Pregled PDF</button>
              </td>
              <td data-label="Brisanje">
                <button @click="deleteUser(user._id)" class="action-btn delete-btn">Obriši korisnika</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="getAllPdfs" class="pdf-btn">Pregled svih PDF-ova</button>
      </section>

      <!-- PDF -->
      <section class="pdfs-section">
        <h2 class="section-title">PDF-ovi</h2>
        <table class="pdfs-table" v-if="pdfs.length > 0">
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Korisnik</th>
              <th>Brisanje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pdf in pdfs" :key="pdf._id">
              <td data-label="Naziv">{{ pdf.originalName || 'PDF' }}</td>
              <td data-label="Korisnik">{{ pdf.user?.username || 'Nepoznat korisnik' }}</td>
              <td data-label="Brisanje">
                <button @click="deletePdf(pdf._id)" class="action-btn delete-btn">Obriši PDF</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-pdfs">Nema učitanih PDF-ova za prikaz.</div>
      </section>
    </div>
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
    users.value = res.data.filter(u => u.role === 'user')
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
    pdfs.value = []
  }
}

const getPdfsByUser = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/admin/pdfs/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    pdfs.value = res.data.length > 0 ? res.data : []
  } catch (err) {
    console.error(err)
    pdfs.value = []
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
  localStorage.removeItem('username')
  window.location.href = '/'
}
</script>

<style scoped>
.upload-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #0D0D0D;
  background-image: url('../assets/Grid.png');
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.upload-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
}
.upload-content.admin-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  width: 90%;
  max-width: 1100px;
  color: #fff;
}

/* Naslovi */
.admin-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #70FCFB;
  margin-bottom: 0.5rem;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #42CFEA;
  margin-bottom: 1rem;
}

/* Logout gumb */
.logout-btn {
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
  color: #0D0D0D;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  padding: 10px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(112, 207, 255, 0.5);
}

/* Tablice */
.users-table, .pdfs-table {
  width: 100%;
  max-width: 1000px;
  border-collapse: collapse;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  table-layout: fixed;
}
.users-table th, .users-table td,
.pdfs-table th, .pdfs-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  word-wrap: break-word;
}
.users-table th, .pdfs-table th {
  background: rgba(66,207,234,0.2);
  color: #fff;
  font-weight: 600;
}

/* Akcijski gumbi */
.action-btn {
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 2px;
  transition: all 0.3s ease;
}

.delete-btn {
  background: rgba(255, 0, 0, 0.5);
  color: #fff;
}
.delete-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

.view-btn {
  background: rgba(66,207,234,0.5);
  color: #0D0D0D;
}
.view-btn:hover {
  background: rgba(66,207,234,0.8);
  transform: scale(1.05);
}

/* PDF gumb ispod tablice */
.pdf-btn {
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
  color: #0D0D0D;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 18px;
  margin-top: 15px;
  transition: all 0.3s ease;
}
.pdf-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(112, 207, 255, 0.5);
}

/* Poruka ako nema PDF-ova */
.no-pdfs {
  color: #B0E0FF;
  font-weight: 600;
  padding: 1rem 0;
}

/* Responzivno */
@media (max-width: 768px) {
  .upload-content.admin-content {
    padding: 25px 15px;
  }
  .admin-title {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
  .section-title {
    font-size: clamp(1.3rem, 4vw, 1.8rem);
  }
  .action-btn {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
  .pdf-btn {
    font-size: 0.8rem;
    padding: 8px 20px;
  }

  /* Tablice postaju kartice */
  .users-table, .pdfs-table {
    display: block;
    width: 100%;
  }
  .users-table thead, .pdfs-table thead {
    display: none;
  }
  .users-table tr, .pdfs-table tr {
    display: block;
    margin-bottom: 15px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 10px;
  }
  .users-table td, .pdfs-table td {
    display: block;
    text-align: right;
    padding: 8px 10px;
    position: relative;
  }
  .users-table td::before, .pdfs-table td::before {
    content: attr(data-label);
    float: left;
    font-weight: 600;
    color: #42CFEA;
  }
}
</style>
