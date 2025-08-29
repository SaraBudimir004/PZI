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
.flashcard-card {
  width: 90%;
  max-width: 900px;
  margin: auto;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
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
  border-radius: 15px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  backface-visibility: hidden;
  transition: transform 0.6s;
  position: absolute;
  font-size: 1.5rem;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.flashcard .back {
  background: #f0f0f0;
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
  justify-content: space-around;
  margin-top: 20px;
}
</style>
