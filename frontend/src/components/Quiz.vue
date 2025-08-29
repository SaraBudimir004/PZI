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
              :class="selectedIndex === index ? (isCorrect(option) ? 'correct' : 'wrong') : ''"
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
import { ref, onMounted } from 'vue'
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const pdfId = route.query.pdfId;

const questions = ref([]);
const currentIndex = ref(0);
const selectedIndex = ref(null);
const currentQuestion = ref({});

const fetchQuiz = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/ai/quiz/${pdfId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    questions.value = res.data.quiz.map(q => ({
      question: q.pitanje,
      options: q.odgovori,
      answer: q.tocan
    }));

    if (questions.value.length > 0) {
      currentIndex.value = 0;
      currentQuestion.value = questions.value[0];
    }
  } catch (err) {
    console.error("Greška pri dohvaćanju kviza:", err);
  }
};

const selectOption = (option, index) => {
  selectedIndex.value = index;
};

const isCorrect = (option) => {
  if (!currentQuestion.value.answer) return false;
  return option[0].toLowerCase() === currentQuestion.value.answer.toLowerCase();
};


const nextQuestion = () => {
  selectedIndex.value = null;
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
  currentQuestion.value = questions.value[currentIndex.value];
};

onMounted(() => {
  if (pdfId) fetchQuiz();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.quiz-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d0d0d; /* fullscreen crno */
  padding: 20px;
}

.quiz-card {
  width: 90%;
  max-width: 800px;
  margin: auto;
  padding: 40px 30px;
  border-radius: 20px;
  background: #1b1b1b; /* tamna kartica */
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.quiz-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
}

.question {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: #e0e0e0;
  margin-bottom: 25px;
}

.option-btn {
  width: 100%;
  margin: 10px 0;
  padding: 16px 0;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 14px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-btn:hover {
  background: #3a3a3a;
  transform: translateY(-1px);
}

.option-btn.correct {
  background-color: #2e7d32 !important;
  color: #fff !important;
}

.option-btn.wrong {
  background-color: #c62828 !important;
  color: #fff !important;
}

.next-btn {
  margin-top: 25px;
  font-weight: 600;
  font-size: 1.2rem;
  background: #2c2c2c;
  color: #e0e0e0;
  width: 100%;
  padding: 16px 0;
  border-radius: 14px;
  border: 1px solid #444;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.next-btn:hover {
  background: #3a3a3a;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .quiz-card {
    padding: 30px 20px;
  }
  .question {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }
  .option-btn, .next-btn {
    font-size: 1rem;
    padding: 14px 0;
  }
}
</style>
