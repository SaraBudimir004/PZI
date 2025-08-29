<template>
  <v-container fluid class="upload-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="6" class="upload-content">
        <!-- Naslov i podnaslov -->
        <h2 class="upload-title">UČITAJ SKRIPTU</h2>
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

        <!-- Dugme za dashboard -->
        <v-btn class="upload-btn" rounded block @click="goToDashboard">
          Idi na svoje materijale
        </v-btn>
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

// Funkcija za upload PDF-a (rad i za goste i za korisnike)
const handleUpload = async () => {
  if (!file.value) return alert("Odaberi PDF datoteku!")
  if (!pdfName.value.trim()) return alert("Unesi ime PDF-a!")

  loading.value = true
  message.value = ""

  try {
    const formData = new FormData()
    formData.append("file", file.value)
    formData.append("name", pdfName.value)

    // Dohvati token (gost ili korisnik)
    const token = localStorage.getItem('token') || localStorage.getItem('guestToken')
    if (!token) {
      message.value = "Niste prijavljeni!"
      loading.value = false
      return
    }

    // Provjeri je li gost
    const isGuest = !!localStorage.getItem('guestToken')
    const url = isGuest 
      ? "http://localhost:5000/gost/upload" 
      : "http://localhost:5000/pdf/upload"

    const res = await axios.post(
        url,
        formData,
        {headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`}}
    )

    message.value = "PDF je uspješno uploadan!"
    dialog.value = false
    pdfName.value = ""
    file.value = null

    // Preusmjeri na Dashboard
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.message || "Greška pri uploadu PDF-a"
  } finally {
    loading.value = false
  }
}

// Funkcija za dugme "Idi na svoje materijale"
const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
/* Glavni container za upload */
.upload-container {
   position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  background-image: url('../assets/Grid.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;       
  background-attachment: fixed;  
  text-align: center;
  background-color: #0D0D0D;
  color: #fff;
}


.upload-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
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
  width: 90%;          
  max-width: 600px;   
  padding: 40px 30px;
  background: rgba(0,0,0,0.7); 
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-sizing: border-box;
  text-align: center;
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

/* Dugme za upload i dashboard (isti stil kao registracija/prijava) */
.upload-btn {
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  text-transform: none;
  width: 100%;
  max-width: 500px;
  padding: 14px 0;
  border-radius: 16px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(112, 252, 251, 0.6);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
}

/* Poruka o uploadu */
.upload-message {
  margin-top: 10px;
  color: #70FCFB;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .upload-content {
    max-width: 450px;
    padding: 35px 25px;
  }

  .upload-title {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }

  .upload-subtitle {
    font-size: clamp(0.9rem, 4vw, 1.3rem);
  }

  .upload-btn {
    font-size: 0.95rem;
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  .upload-content {
    width: 90%;
    padding: 25px 15px;
  }

  .upload-title {
    font-size: clamp(1.5rem, 8vw, 2.2rem);
  }

  .upload-subtitle {
    font-size: clamp(0.8rem, 5vw, 1.1rem);
  }

  .upload-btn {
    font-size: 0.9rem;
    padding: 10px 0;
  }
}

</style>
