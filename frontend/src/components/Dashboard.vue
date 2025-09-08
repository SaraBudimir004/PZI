<template>
  <v-app>
    <Sidebar
        :userPdfs="userPdfs"
        @pdf-select="selectPdf"
        @upload-click="openUploadModal"
        @pdf-deleted="handlePdfDeleted"
    />

    <v-main>
      <v-container>
        <UserHeader />

        <!-- PDF kartica -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card v-if="uploadedPdf.name" class="pa-12 account-card">
              <div class="text-h4 font-weight-bold green--text mb-2">{{ uploadedPdf.name }}</div>
              <div class="grey--text text-caption">Dodano: {{ uploadedPdf.date || '-' }}</div>
              <div class="grey--text text-caption font-mono">Stranice: {{ uploadedPdf.totalPages || 0 }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- kartice za ai -->
        <DashboardCards
            :uploadedPdf="uploadedPdf"
            @open-flashcards="generateAndGoToFlashcards"
            @open-quiz="generateAndGoToQuiz"
            @open-summary="generateAndShowSummary"
            @open-pdf-viewer="openPdfViewer"
        />

        <!-- pregled  i sazetak dijalog -->
        <PdfView
            v-model:show="showPdfDialog"
            :pdfSource="pdfUrl"
            :title="uploadedPdf.name || 'Pregled PDF-a'"
        />

        <PdfView
            v-model:show="showSummary"
            :textContent="summaryText"
            :title="uploadedPdf.name || 'Sažetak PDF-a'"
        />

        <!-- Modal za upload PDF-a -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Upload PDF</v-card-title>
            <v-card-text>
              <!-- ime pdf-a -->
              <v-text-field
                  v-model="pdfName"
                  label="Ime PDF dokumenta"
                  outlined
                  required
              ></v-text-field>

              <!-- Odabir pdf-a -->
              <v-file-input
                  v-model="file"
                  label="Odaberi PDF dokument"
                  accept=".pdf"
                  prepend-icon="mdi-file-pdf"
                  outlined
              ></v-file-input>

              <div v-if="message" class="red--text mt-2">{{ message }}</div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleUpload" :loading="loading">
                Pošalji
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import DashboardCards from "./DashboardCards.vue";
import UserHeader from "./UserHeader.vue";
import PdfView from "./PdfView.vue";

const router = useRouter();

const userPdfs = ref([]);
const uploadedPdf = ref({ id: "", name: "", totalPages: 0, date: "" });
const pdfUrl = ref(null);
const showPdfDialog = ref(false);

const summaryText = ref("");
const showSummary = ref(false);

const dialog = ref(false)
const pdfName = ref("")
const file = ref(null)
const message = ref("")
const loading = ref(false)

const guestInfo = ref(null)

const openUploadModal = () => { dialog.value = true; }

const handleUpload = async () => {
  if (!file.value) return alert("Odaberi PDF datoteku!")
  if (!pdfName.value.trim()) return alert("Unesi ime PDF-a!")

  loading.value = true
  message.value = ""

  try {
    const formData = new FormData()
    formData.append("file", file.value)
    formData.append("name", pdfName.value)

    const token = localStorage.getItem('token') || localStorage.getItem('guestToken')
    if (!token) {
      message.value = "Niste prijavljeni!"
      loading.value = false
      return
    }

    const isGuest = !!localStorage.getItem('guestToken')
    const url = isGuest
        ? "http://localhost:5000/gost/upload"
        : "http://localhost:5000/pdf/upload"

    await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    })

    message.value = "PDF je uspješno uploadan!"
    dialog.value = false
    pdfName.value = ""
    file.value = null

    await fetchUserPdfs()
  } catch (err) {
    console.error(err)
    message.value = err.response?.data?.message || "Greška pri uploadu PDF-a"
  } finally {
    loading.value = false
  }
}

// dohvaca pdf-ove od korisnika
const fetchUserPdfs = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get("http://localhost:5000/pdf/user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    userPdfs.value = res.data;
    if (userPdfs.value.length) uploadedPdf.value = userPdfs.value[0];
  } catch (error) {
    console.error(error);
  }
};

const selectPdf = (pdf) => { uploadedPdf.value = pdf; }

// braisanje PDF-a
const handlePdfDeleted = (deletedPdfId) => {
  userPdfs.value = userPdfs.value.filter(pdf => pdf.id !== deletedPdfId);
  if (uploadedPdf.value.id === deletedPdfId)
    uploadedPdf.value = { id: "", name: "", totalPages: 0, date: "" };
}

const generateAndGoToFlashcards = async (pdfId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Molimo prijavite se");

  try {
    await axios.get(`http://localhost:5000/ai/flashcards/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    router.push({ name: "Flashcards", query: { pdfId } });
  } catch (error) {
    console.error(error);
    alert("Greška pri generiranju flashcards");
  }
};

const generateAndGoToQuiz = async (pdfId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Molimo prijavite se");

  try {
    await axios.get(`http://localhost:5000/ai/quiz/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    router.push({ name: "Quiz", query: { pdfId } });
  } catch (error) {
    console.error(error);
    alert("Greška pri generiranju kviza");
  }
};

const textContent = ref("")

const generateAndShowSummary = async (pdfId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Molimo prijavite se");

  try {
    const res = await axios.get(`http://localhost:5000/ai/summary/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    textContent.value = res.data.summary;
    summaryText.value = res.data.summary;
    showSummary.value = true;
  } catch (error) {
    console.error(error);
    alert("Greška pri generiranju sažetka");
  }
};

// otvaranje PDF modal-a
const openPdfViewer = async (pdfId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Nema tokena, korisnik nije prijavljen");

    const response = await axios.get(`http://localhost:5000/pdf/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });

    pdfUrl.value = URL.createObjectURL(response.data);
    showPdfDialog.value = true;
  } catch (error) {
    console.error("Greška pri učitavanju PDF-a:", error);
  }
};

onMounted(async () => {
  const guestId = localStorage.getItem("guestId");

  if (guestId) {
    guestInfo.value = { guestId };
  } else {
    await fetchUserPdfs();
  }
});
</script>


<style scoped>
.account-card {
  background: linear-gradient(135deg, #0d0d0d 35%, #42cfea 100%);
  color: #fff;
  border-radius: 20px;
  cursor: default;
}
</style>
