<template>
  <v-app>
    <!-- Sidebar navigacija -->
    <v-navigation-drawer width="220" class="side-nav">
      <v-list dense>
        <!-- Logo / naziv aplikacije -->
        <v-list-item class="logo">
          <span class="text-h6 font-weight-bold">Skripte</span>
        </v-list-item>
        <!-- Ostale stavke navigacije mogu ići ovdje -->
      </v-list>
    </v-navigation-drawer>

    <!-- Glavni sadržaj -->
    <v-main>
      <v-container>
        <!-- Header sa pretragom i korisničkim kontrolama -->
        <v-row class="align-center">
          <!-- Polje za pretragu -->
          <v-col cols="6" class="d-flex align-center">
            <v-text-field
                hide-details
                rounded
                filled
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                class="search"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">

            <!-- Avatar i ime korisnika -->
            <v-avatar>
              <img src="https://randomuser.me/api/portraits/women/71.jpg" alt="Korisnik" />
            </v-avatar>
            <span class="ml-2 font-weight-bold">korisnik</span>
          </v-col>
        </v-row>

        <!-- Kartica sa informacijama o PDF-u -->
        <v-col cols="12">
          <v-card v-if="uploadedPdf.name" class="pa-5 account-card">
            <div class="text-h4 font-weight-bold green--text mb-4"> {{ uploadedPdf.name }} </div>
            <div class="grey--text text-caption">Dodano: {{ uploadedPdf.date || '-' }} </div>
            <div class="grey--text text-caption font-mono">Stranice: {{ uploadedPdf.totalPages || 0 }}</div>
          </v-card>
        </v-col>

        <!-- Kartice sa akcijama -->
        <v-container class="custom-container" fluid>
          <v-row>
            <!-- Flashcards kartica -->
            <v-col cols="12" md="6" class="mb-4">
              <v-card class="pa-10" elevation="3"
                      style="background: white; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.1); cursor:pointer;">
                <div class="text-h5 font-weight-bold text-center" style="color: #133634;">Flashcards</div>
              </v-card>
            </v-col>

            <!-- Kviz kartica -->
            <v-col cols="12" md="6" class="mb-4">
              <v-card class="pa-10" elevation="3"
                      style="background: white; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.1); cursor:pointer;">
                <div class="text-h5 font-weight-bold text-center" style="color: #133634;">Kviz</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <!-- Sažetak PDF-a kartica -->
            <v-col cols="12" md="6" class="mb-4">
              <v-card class="pa-10" elevation="3"
                      style="background: white; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.1); cursor:pointer;">
                <div class="text-h5 font-weight-bold text-center" style="color: #133634;">Sažetak Pdf-a</div>
              </v-card>
            </v-col>

            <!-- Pregled PDF-a kartica (otvara modal) -->
            <v-col cols="12" md="6" class="mb-4">
              <v-card class="pa-10" elevation="3"
                      style="background: white; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.1); cursor:pointer;"
                      @click="openPdfViewer(uploadedPdf.id)">
                <div class="text-h5 font-weight-bold text-center" style="color: #133634;">Pregledaj Pdf</div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>

    <!-- Modal za prikaz PDF-a -->
    <PdfView
        v-model:show="showPdf"
        :pdfSource="pdfUrl"
        :title="uploadedPdf.name || 'Pregled PDF-a'"
    />
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import PdfView from "./PdfView.vue";
import axios from "axios";

export default {
  name: "Dashboard",
  components: { PdfView },

  setup() {
    const route = useRoute();

    // PDF informacije
    const uploadedPdf = ref({
      id: "",
      name: "",
      totalPages: 0,
      date: ""
    });

    // Modal prikaza PDF-a
    const showPdf = ref(false);
    const pdfUrl = ref("");

    // Popuni podatke o PDF-u sa query parametara (ili kasnije s API-ja)
    onMounted(() => {
      uploadedPdf.value = {
        id: route.query.id || "",
        name: route.query.name || "",
        totalPages: route.query.pages || 0,
        date: route.query.date || ""
      };
    });

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

    return {
      uploadedPdf,
      showPdf,
      pdfUrl,
      openPdfViewer
    };
  }
};
</script>

<style scoped>
/* Sidebar stil */
.side-nav {
  background: #efffff;
  border-radius: 20px 0 0 20px;
}

/* Logo */
.logo {
  margin-bottom: 28px;
}

/* Kartica sa informacijama o PDF-u */
.account-card {
  background: linear-gradient(135deg, #0d0d0d 35%, #42cfea 100%);
  color: #fff;
  border-radius: 20px;
}
</style>
