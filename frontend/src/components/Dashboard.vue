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

        <!-- Dashboard kartice -->
        <DashboardCards
            :uploadedPdf="uploadedPdf"
            @open-flashcards="generateAndGoToFlashcards"
            @open-quiz="generateAndGoToQuiz"
            @open-summary="generateAndShowSummary"
            @open-pdf-viewer="openPdfViewer"
        />

        <!-- PdfView dijalog -->
        <PdfView
            v-model:show="showPdf"
            :pdfSource="pdfUrl"
            :title="uploadedPdf.name || 'Pregled PDF-a'"
        />

        <PdfView
            v-model:show="showSummary"
            :textContent="summaryText"
            :title="uploadedPdf.name || 'Sažetak PDF-a'"
        />

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "./Sidebar.vue";
import DashboardCards from "./DashboardCards.vue";
import UserHeader from "./UserHeader.vue";
import PdfView from "./PdfView.vue";

export default {
  name: "Dashboard",
  components: { Sidebar, DashboardCards, UserHeader, PdfView },
  setup() {
    const router = useRouter();
    const userPdfs = ref([]);
    const uploadedPdf = ref({ id: "", name: "", totalPages: 0, date: "" });
    const pdfUrl = ref(null);
    const showPdf = ref(false);

    const summaryText = ref("");
    const showSummary = ref(false);

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

    const selectPdf = (pdf) => {
      uploadedPdf.value = pdf;
    };

    const handlePdfDeleted = (deletedPdfId) => {
      userPdfs.value = userPdfs.value.filter(pdf => pdf.id !== deletedPdfId);
      if (uploadedPdf.value.id === deletedPdfId)
        uploadedPdf.value = { id: "", name: "", totalPages: 0, date: "" };
    };

    const generateAndGoToFlashcards = async (pdfId) => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Molimo prijavite se");

      try {
        const res = await axios.get(`http://localhost:5000/ai/flashcards/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Flashcards generirane:", res.data);
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
        const res = await axios.get(`http://localhost:5000/ai/quiz/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Kviz generiran:", res.data);
        router.push({ name: "Quiz", query: { pdfId } });
      } catch (error) {
        console.error(error);
        alert("Greška pri generiranju kviza");
      }
    };

    const textContent = ref("");

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



    // Funkcija za otvaranje PDF modal-a
    async function openPdfViewer(pdfId) {
      try {
        const token = localStorage.getItem("token");
        console.log("Token koji šaljem:", token);
        if (!token) throw new Error("Nema tokena, korisnik nije prijavljen");

        const response = await axios.get(`http://localhost:5000/pdf/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        const blobUrl = URL.createObjectURL(response.data);
        pdfUrl.value = blobUrl;
        showPdf.value = true;
      } catch (error) {
        console.error("Greška pri učitavanju PDF-a:", error);
      }
    }




    onMounted(fetchUserPdfs);

    return {
      userPdfs,
      uploadedPdf,
      selectPdf,
      handlePdfDeleted,
      generateAndGoToFlashcards,
      generateAndGoToQuiz,
      generateAndShowSummary,
      openPdfViewer,
      pdfUrl,
      showPdf,
      summaryText,
      showSummary
    };
  }
};
</script>

<style scoped>
.account-card {
  background: linear-gradient(135deg, #0d0d0d 35%, #42cfea 100%);
  color: #fff;
  border-radius: 20px;
  cursor: default;
}
</style>
