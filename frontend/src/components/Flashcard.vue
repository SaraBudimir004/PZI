<template>
  <v-app style="height: 100vh; width: 100vw;">
    <v-container class="flashcard-container" fluid>
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
          <v-btn class="btn correct" @click="nextCard(true)">Točno</v-btn>
          <v-btn class="btn wrong" @click="nextCard(false)">Netočno</v-btn>
          <v-btn class="btn next" @click="nextCard()">Iduća</v-btn>
        </div>
      </v-card>
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

    const currentCard = computed(
      () => flashcards.value[currentIndex.value] || { pitanje: "", odgovor: "" }
    );

    const fetchFlashcards = async () => {
      if (!pdfId) return;
      loading.value = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/ai/flashcards/${pdfId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

    const nextCard = () => {
      flipped.value = false;
      currentIndex.value =
        currentIndex.value < flashcards.value.length - 1 ? currentIndex.value + 1 : 0;
    };

    onMounted(fetchFlashcards);

    return {
      flashcards,
      currentCard,
      flipped,
      loading,
      flipCard,
      nextCard,
    };
  },
};
</script>

<style scoped>
.flashcard-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0D0D0D; /* fullscreen crna pozadina */
  margin: 0;
  padding: 0;
}

.flashcard-card {
  width: 90%;
  max-width: 700px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.flashcard {
  width: 100%;
  height: 400px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}

.flashcard .front,
.flashcard .back {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: #1e1e1e;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  backface-visibility: hidden;
  transition: transform 0.6s;
  position: absolute;
  font-size: 1.5rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.flashcard .back {
  background: #2a2a2a;
  transform: rotateY(180deg);
}

.flashcard.flipped .front {
  transform: rotateY(180deg);
}

.flashcard.flipped .back {
  transform: rotateY(0deg);
}

.flashcard-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  flex: 1;
  min-width: 120px;
  background: #333 !important;
  color: #fff !important;
  border-radius: 10px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.btn:hover {
  background: #444 !important;
}

.correct {
  background: #2e7d32 !important; 
}

.wrong {
  background: #c62828 !important; 
}

.next {
  background: #1565c0 !important; 
}

@media (max-width: 768px) {
  .flashcard {
    height: 300px;
  }

  .flashcard .front,
  .flashcard .back {
    font-size: 1.2rem;
    padding: 15px;
  }

  .btn {
    flex: 1 1 100%;
  }
}
</style>
