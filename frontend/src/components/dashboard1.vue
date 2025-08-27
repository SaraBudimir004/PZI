<template>
  <v-container fluid class="pa-6 dashboard">
    <!-- HEADER -->
    <v-row v-if="uploadedPdf.name">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">{{ uploadedPdf.name }}</h1>
        <p class="text-subtitle-2 grey--text">
          Dodano: {{ uploadedPdf.date || '-' }} | Stranice: {{ uploadedPdf.totalPages || 0 }}
        </p>
      </v-col>
    </v-row>


    <v-row>
      <!-- GLAVNI GRID -->
      <v-col cols="12" md="9">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-card class="dashboard-card gradient-purple" height="150">
              <v-card-title>Generiraj Flashcards</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="dashboard-card gradient-pink" height="150">
              <v-card-title>Generiraj Kviz</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="dashboard-card gradient-blue" height="150">
              <v-card-title>Sažetak Skripte</v-card-title>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="dashboard-card gradient-green" height="150">
              <v-card-title>Pregled PDF-a</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- SIDEBAR -->
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <h3 class="text-h6 mb-4">Statistika</h3>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>Flashcards</v-list-item-content>
              <v-list-item-action>{{ stats.flashcards }}</v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Kvizovi</v-list-item-content>
              <v-list-item-action>{{ stats.quizzes }}</v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>Pregledi</v-list-item-content>
              <v-list-item-action>{{ stats.views }}</v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="pa-4 mt-4">
          <h3 class="text-h6 mb-4">Zadnje aktivnosti</h3>
          <v-list dense>
            <v-list-item v-for="(activity, index) in activities" :key="index">
              {{ activity }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

const uploadedPdf = ref({
  id: '',
  name: '',
  totalPages: 0,
  date: ''
})

onMounted(() => {
  uploadedPdf.value = {
    id: route.query.id || '',
    name: route.query.name || '',
    totalPages: route.query.pages || 0,
    date: route.query.date || ''
  }
})

// Statistika i aktivnosti
const stats = ref({
  flashcards: 0,
  quizzes: 0,
  views: 0
});

const activities = ref([
  'Generiran flashcard set',
  'Završen kviz',
  'Pregledana skripta'
]);

</script>

<style scoped>
.dashboard {
  background-color: #f8f9fd;
  min-height: 100vh;
}

.dashboard-card {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  border-radius: 16px;
}

.gradient-purple {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

.gradient-pink {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.gradient-blue {
  background: linear-gradient(135deg, #36d1dc, #5b86e5);
}

.gradient-green {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
}
</style>
