<template>
  <v-container fluid class="hero-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="8" class="hero-content">
        <h1 class="main-title">{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>

        <!-- Standard login -->
        <v-btn :to="buttonLink1" class="get-started-btn" rounded block>
          Prijavi se
        </v-btn>

        <!-- Guest login -->
        <v-btn @click="loginAsGuest" class="get-started-btn" rounded block>
          Nastavi kao gost
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios"; 
import { useRouter } from "vue-router";
import { loginGuest } from "../services/auth";

const props = defineProps({
  title: { type: String, default: "AI Pomoćnik za Učenje" },
  subtitle: { type: String, default: "Brže i pametnije učenje pomoću AI-a" },
  buttonLink1: { type: String, default: "/login" }
});

const router = useRouter();

const loginAsGuest = async () => {
  try {
    let token = localStorage.getItem("guestToken");

    if (!token) {
      // Ako nema tokena, kreiraj novog gosta
      const res = await axios.post("http://localhost:5000/gost/login"); 
      token = res.data.token;

      // Spremi token u localStorage
      localStorage.setItem("guestToken", token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("guestId", res.data.guestId);
    }

    // Preusmjeri korisnika na upload PDF ili dashboard
    router.push("/uploadpdf");
  } catch (err) {
    console.error("Greška pri prijavi gosta:", err);
    alert("Greška pri prijavi gosta. Pokušajte ponovno.");
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.hero-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #0D0D0D;
  background-image: url('../assets/Grid.png');
  background-position: center;
  background-repeat: no-repeat;
}
.hero-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.main-title { font-family: 'Poppins', sans-serif; font-weight: 700; color: #fff; font-size: clamp(2.5rem, 6vw, 5rem); margin: 0; }
.subtitle { font-family: 'Poppins', sans-serif; font-weight: 400; color: #ccc; font-size: clamp(1.2rem, 3vw, 2rem); margin: 0; }
.get-started-btn {
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  min-width: 400px;
  max-width: 500px;
  padding: 16px 32px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(112, 252, 251, 0.5);
  backdrop-filter: blur(10px);
  font-size: 1.2rem;
  transition: all 0.3s ease;
}
.get-started-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 30px rgba(112, 252, 251, 0.7);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
}
@media (max-width: 1024px) { .main-title { font-size: clamp(2rem, 7vw, 4rem); } .subtitle { font-size: clamp(1rem, 4vw, 1.8rem); } .get-started-btn { padding: 14px 32px; } }
@media (max-width: 600px) { .main-title { font-size: clamp(1.8rem, 8vw, 3.5rem); } .subtitle { font-size: clamp(0.9rem, 5vw, 1.5rem); } .get-started-btn { padding: 12px 28px; } }
</style>
