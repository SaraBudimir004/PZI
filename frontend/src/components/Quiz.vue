<template>
  <v-container fluid class="quiz-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" class="quiz-col">
        <v-card class="quiz-card">
          <v-card-text>
            <div class="question">{{ currentQuestion.question }}</div>

            <v-btn
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="option-btn"
                :color="selectedIndex === index ? (isCorrect(option) ? 'success' : 'error') : 'white'"
                :disabled="selectedIndex !== null"
                @click="selectOption(option, index)"
                rounded
            >
              {{ option }}
            </v-btn>
          </v-card-text>
        </v-card>

        <v-btn
            v-if="selectedIndex !== null"
            class="next-btn"
            rounded
            large
            @click="nextQuestion"
        >
          Idi dalje
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    question: "Što je AI?",
    options: ["Umjetna inteligencija", "Elektronika", "Programiranje"],
    answer: "Umjetna inteligencija"
  },
  {
    question: "Što je ML?",
    options: ["Strojno učenje", "Matematičko učenje", "Motorno učenje"],
    answer: "Strojno učenje"
  },
  {
    question: "Što je Deep Learning?",
    options: ["Duboko učenje", "Površinsko učenje", "Linearno učenje"],
    answer: "Duboko učenje"
  },
])

const currentIndex = ref(0)
const selectedIndex = ref(null)
const currentQuestion = ref(questions.value[currentIndex.value])

const selectOption = (option, index) => {
  selectedIndex.value = index
}

const isCorrect = (option) => {
  return option === currentQuestion.value.answer
}

const nextQuestion = () => {
  selectedIndex.value = null
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  currentQuestion.value = questions.value[currentIndex.value]
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.flashcard-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d0d0d;
  padding: 20px;
}

.flashcard-card {
  width: 100%;
  max-width: 700px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
}

.question {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: #fff;
  text-align: center;
}

.btn {
  flex: 1;
  min-width: 120px;
  background: #333 !important;
  color: #fff !important;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 10px 0;
  padding: 15px 0;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background: #444 !important;
  transform: translateY(-2px);
}

.correct {
  background: #2e7d32 !important; /* diskretna zelena */
}

.wrong {
  background: #c62828 !important; /* diskretna crvena */
}

.next {
  background: #1565c0 !important; /* diskretna plava */
}

@media (max-width: 768px) {
  .flashcard-card {
    padding: 30px;
  }
  .question {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }
  .btn {
    font-size: 1rem;
    min-width: 100px;
    padding: 12px 0;
  }
}
</style>
