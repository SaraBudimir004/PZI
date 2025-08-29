<template>
  <section class="register-container">
    <div class="register-content">
      <h2 class="register-title">Prijava</h2>
      <p class="register-subtitle">Prijavite se u svoj račun i počnite učiti uz AI pomoćnika</p>

      <form @submit.prevent="handleSubmit" class="register-form">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="register-btn">Prijavite se</button>
      </form>

      <p v-if="error" style="color:red;">{{ error }}</p>

      <p class="login-link">
        Nemate račun?
        <router-link to="/register">Registrirajte se</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { loginUser, loginAdmin } from '../services/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';

  try {
    // pokušaj login kao admin
    const res = await loginAdmin(username.value, password.value);

    // Spremi token, role i user objekt
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', 'admin');
    localStorage.setItem('user', JSON.stringify({
      name: username.value,
      avatar: ''
    }));

    router.push('/admin-panel');

  } catch (adminErr) {
    console.log("Admin login failed:", adminErr);

    try {
      // login običnog korisnika
      const resUser = await loginUser(username.value, password.value);

      localStorage.setItem('token', resUser.data.token);
      localStorage.setItem('role', 'user');
      localStorage.setItem('user', JSON.stringify({
        name: resUser.data.user.username || username.value,
        avatar: resUser.data.user.avatar || ''
      }));

      router.push('/uploadpdf');

    } catch (userErr) {
      console.error("User login failed:", userErr);
      error.value = userErr.response?.data?.message || 'Neispravni podaci za prijavu';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* Container */
.register-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  background-image: url('../assets/Grid.png');
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  background-color: #0D0D0D;
  color: #fff;
}

.register-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
}

/* Centrirani sadržaj */
.register-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 40%;
  max-height: 40%;
  width: 100%;
  align-items: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

/* Naslov i podnaslov */
.register-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 3rem);
  margin: 0;
}

.register-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: #B0E0FF;
  margin: 0;
}

/* Form inputi */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.register-form input {
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
}

.register-form input::placeholder {
  color: #ccc;
}

.register-form input:focus {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px #70FCFB;
}

/* Gumb prijave */
.register-btn {
  padding: 14px 0;
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  font-weight: 600;
  border-radius: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(112, 252, 251, 0.6);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
}

/* Link za registraciju */
.login-link {
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #B0E0FF;
}

.login-link a {
  color: #70FCFB;
  text-decoration: underline;
  margin-left: 5px;
}

/* Responsive */
@media (max-width: 600px) {
  .register-content {
    padding: 30px 20px;
  }

  .register-title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
  }

  .register-subtitle {
    font-size: clamp(0.9rem, 5vw, 1.2rem);
  }

  .register-btn {
    font-size: 0.95rem;
    padding: 12px 0;
  }
}
</style>
