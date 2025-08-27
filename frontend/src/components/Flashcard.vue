<template>
  <div>
    <!-- Gumb za generiranje flashcards -->
    <v-btn color="primary" @click="loadFlashcards" :loading="loading">
      Generiraj Flashcards
    </v-btn>

    <!-- Prozor s flashcards -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Flashcards</v-card-title>
        <v-card-text>
          <div v-if="flashcards.length">
            <div class="flashcard-container">
              <div
                  class="flashcard"
                  :class="{ flipped: flipped }"
                  @click="flipCard"
              >
                <div class="front">{{ currentCard.pitanje }}</div>
                <div class="back">{{ currentCard.odgovor }}</div>
              </div>
              <v-btn color="secondary" @click="nextCard">Idi na drugu karticu</v-btn>
            </div>
          </div>
          <div v-else>Još nema flashcards...</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    pdfId: String
  },
  data() {
    return {
      loading: false,
      flashcards: [],
      dialog: false,
      currentIndex: 0,
      flipped: false
    };
  },
  computed: {
    currentCard() {
      return this.flashcards[this.currentIndex] || {};
    }
  },
  methods: {
    async loadFlashcards() {
      this.loading = true;
      try {
        const res = await axios.get(`/api/pdf/${this.pdfId}/flashcards`);
        this.flashcards = res.data.flashcards;
        this.dialog = true;
      } catch (err) {
        console.error(err);
        alert("Greška pri učitavanju flashcards");
      } finally {
        this.loading = false;
      }
    },
    flipCard() {
      this.flipped = !this.flipped;
    },
    nextCard() {
      this.flipped = false;
      if (this.currentIndex < this.flashcards.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // vrati na prvu karticu
      }
    }
  }
};
</script>

<style scoped>
.flashcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flashcard {
  width: 300px;
  height: 200px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 10px;
}

.flashcard .front,
.flashcard .back {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #f5f5f5;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  backface-visibility: hidden;
  transition: transform 0.6s;
  position: absolute;
}

.flashcard .back {
  background: #cce5ff;
  transform: rotateY(180deg);
}

.flashcard.flipped .front {
  transform: rotateY(180deg);
}

.flashcard.flipped .back {
  transform: rotateY(0deg);
}
</style>
