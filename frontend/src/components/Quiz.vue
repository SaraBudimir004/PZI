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

.quiz-container {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.quiz-card {
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.question {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  margin-bottom: 20px;
}

/* Opcije */
.option-btn {
  width: 100%;
  margin: 10px 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #0D0D0D;
  background: #ffffff;
  text-transform: none;
  transition: all 0.3s ease;
}

.option-btn:hover {
  background: #e0f7fa;
}

/* Gumb Idi dalje */
.next-btn {
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  text-transform: none;
  padding: clamp(12px, 2vw, 20px) clamp(24px, 5vw, 60px);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(112, 252, 251, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.next-btn:hover {
  transform: translateY(-3px) scale(1.05);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
  box-shadow: 0 12px 30px rgba(112, 252, 251, 0.7);
}

/* Responzivno */
@media (max-width: 600px) {
  .quiz-card {
    padding: 15px;
  }

  .question {
    font-size: clamp(1.2rem, 4vw, 1.5rem);
  }

  .option-btn {
    font-size: 0.95rem;
  }

  .next-btn {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}
</style>
