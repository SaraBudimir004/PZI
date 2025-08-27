<template>
  <v-container fluid class="upload-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="6" class="upload-content">
        <!-- Naslov i podnaslov -->
        <h2 class="upload-title">Učitaj Skriptu</h2>
        <p class="upload-subtitle">
          Odaberite PDF datoteku kako biste dodali svoj materijal za učenje
        </p>

        <!-- Gumb za otvaranje modala -->
        <v-btn class="upload-btn" rounded block @click="dialog = true">
          Učitaj materijale
        </v-btn>

        <!-- Modal za upload PDF-a -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Upload PDF</v-card-title>
            <v-card-text>
              <!-- Ime PDF-a -->
              <v-text-field
                  v-model="pdfName"
                  label="Ime PDF dokumenta"
                  outlined
                  required
              ></v-text-field>

              <!-- Odabir PDF datoteke -->
              <v-file-input
                  v-model="file"
                  label="Odaberi PDF dokument"
                  accept=".pdf"
                  prepend-icon="mdi-file-pdf"
                  outlined
              ></v-file-input>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleUpload" :loading="loading">
                Pošalji
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Poruka o statusu upload-a -->
        <div v-if="message" class="upload-message">{{ message }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Reaktivne varijable
const dialog = ref(false)
const pdfName = ref("")
const file = ref(null)
const message = ref("")
const loading = ref(false)

const router = useRouter()

// Funkcija za upload PDF-a
const handleUpload = async () => {
  if (!file.value) return alert("Odaberi PDF datoteku!")
  if (!pdfName.value.trim()) return alert("Unesi ime PDF-a!")

  loading.value = true
  message.value = ""

  try {
    const formData = new FormData()
    formData.append("file", file.value)
    formData.append("name", pdfName.value)

    // Dohvati token (guest ili user)
    const token = localStorage.getItem("guestToken") || localStorage.getItem("userToken")
    if (!token) {
      message.value = "Niste prijavljeni!"
      loading.value = false
      return
    }

    // Upload na backend
    const res = await axios.post(
        "http://localhost:5000/pdf/upload",
        formData,
        {headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`}}
    )

    // Pripremi podatke za dashboard
    const uploadedPdfId = res.data.pdfId || null
    const uploadedPdfName = pdfName.value
    const totalPages = res.data.totalPages || 0
    const uploadDate = new Date().toLocaleDateString()

    message.value = "PDF je uspješno uploadan!"
    dialog.value = false
    pdfName.value = ""
    file.value = null

    // Preusmjeri na Dashboard sa query parametrima
    router.push({
      path: '/dashboard',
      query: {
        id: uploadedPdfId,
        name: uploadedPdfName,
        pages: totalPages,
        date: uploadDate
      }
    })
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.error || "Greška pri uploadu PDF-a"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Glavni container za upload */
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
}

.upload-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
}

/* Kartica s upload sadržajem */
.upload-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}

/* Naslov i podnaslov */
.upload-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 3rem);
  color: #fff;
  margin: 0;
}

.upload-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: #B0E0FF;
  margin: 0;
}

/* Dugme za upload */
.upload-btn {
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  text-transform: none;
  min-width: 400px;
  max-width: 500px;
  padding: 16px 32px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(112, 252, 251, 0.5);
  backdrop-filter: blur(10px);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 30px rgba(112, 252, 251, 0.7);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
}

/* Poruka o uploadu */
.upload-message {
  margin-top: 10px;
  color: #70FCFB;
  font-weight: 600;
}
</style>
