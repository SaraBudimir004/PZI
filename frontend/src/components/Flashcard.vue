<template>
  <v-app>
    <v-container class="mt-6 d-flex justify-center">
      <v-row>
        <v-col cols="12">
          <v-card class="flashcard-card">
            <div
                class="flashcard"
                :class="{ flipped: flipped }"
                @click="flipCard"
            >
              <div class="front">{{ currentCard.pitanje }}</div>
              <div class="back">{{ currentCard.odgovor }}</div>
            </div>

            <div class="flashcard-buttons">
              <v-btn color="green" @click="nextCard(true)">Točno</v-btn>
              <v-btn color="red" @click="nextCard(false)">Netočno</v-btn>
              <v-btn color="blue" @click="nextCard()">Iduća kartica</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "FlashcardsPage",
  setup() {
    const route = useRoute();
    const pdfId = route.query.pdfId;

    const flashcards = ref([]);
    const currentIndex = ref(0);
    const flipped = ref(false);
    const loading = ref(false);

    const currentCard = computed(() => flashcards.value[currentIndex.value] || { pitanje: "", odgovor: "" });

    const fetchFlashcards = async () => {
      if (!pdfId) return;
      loading.value = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/ai/flashcards/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        flashcards.value = res.data.flashcards || [];
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const flipCard = () => {
      flipped.value = !flipped.value;
    };

    const nextCard = (correct = null) => {
      // correct: true = točno, false = netočno, null = samo iduća
      flipped.value = false;
      currentIndex.value = currentIndex.value < flashcards.value.length - 1 ? currentIndex.value + 1 : 0;
    };

    onMounted(fetchFlashcards);

    return {
      flashcards,
      currentCard,
      flipped,
      loading,
      flipCard,
      nextCard
    };
  }
};
</script>

<style scoped>
/* Fullscreen tamna pozadina */
.v-application {
  background-color: #0d0d0d !important;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glavni container */
.flashcard-card {
  width: 90%;
  max-width: 900px;
  margin: auto;
  padding: 30px;
  border-radius: 20px;
  background: #1b1b1b; /* tamna kartica */
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.flashcard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
}

/* Kartice */
.flashcard {
  width: 100%;
  max-width: 800px;
  height: 400px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}

.flashcard .front,
.flashcard .back {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: #2a2a2a; /* tamno siva */
  color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  backface-visibility: hidden;
  transition: transform 0.6s, background 0.3s ease;
  position: absolute;
  font-size: 1.5rem;
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

.flashcard .back {
  background: #3a3a3a; /* malo svjetlija strana za odgovor */
  transform: rotateY(180deg);
}

.flashcard.flipped .front {
  transform: rotateY(180deg);
}

.flashcard.flipped .back {
  transform: rotateY(0deg);
}

/* Centrirane tipke */
.flashcard-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
}

.flashcard-buttons .v-btn {
  flex: 1 1 30%;
  min-width: 100px;
  max-width: 200px;
  padding: 12px 0;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 12px;
  color: #e0e0e0;
  background: #2c2c2c;
  border: 1px solid #444;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flashcard-buttons .v-btn:hover {
  background: #3a3a3a;
  transform: translateY(-1px);
}

/* Boje tipki za Točno/Netočno/Iduća */
.flashcard-buttons .v-btn[color="green"] {
  background: #2e7d32; 
  color: #fff;
}

.flashcard-buttons .v-btn[color="red"] {
  background: #c62828; 
  color: #fff;
}

.flashcard-buttons .v-btn[color="blue"] {
  background: #1565c0; 
  color: #fff;
}

/* Responsivno za manje ekrane */
@media (max-width: 768px) {
  .flashcard-card {
    padding: 20px;
  }
  .flashcard {
    height: 300px;
  }
  .flashcard .front,
  .flashcard .back {
    font-size: 1.2rem;
    padding: 15px;
  }
  .flashcard-buttons .v-btn {
    font-size: 1rem;
    padding: 10px 0;
    flex: 1 1 45%;
  }
}

@media (max-width: 480px) {
  .flashcard {
    height: 250px;
  }
  .flashcard-buttons {
    gap: 10px;
  }
  .flashcard-buttons .v-btn {
    flex: 1 1 100%;
  }
}

</style>
