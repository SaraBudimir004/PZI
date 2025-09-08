<template>
  <v-row class="align-center user-header-container">
    <v-col cols="6" class="d-flex align-center">
      <v-avatar size="50" class="user-avatar">
        <img :src="user.avatar" alt="Korisnik" />
      </v-avatar>
      <span class="username">{{ user.username || 'Korisnik' }}</span>
    </v-col>

    <v-col cols="6" class="d-flex justify-end align-center">
      <v-btn class="logout-btn" @click="logout" elevation="2">
        <v-icon left>mdi-logout</v-icon>
        Odjavi se
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";

const fixedAvatar = "https://i.pinimg.com/200x/30/e5/18/30e5185980e8eca9a44f8647f7780d0c.jpg";

const user = ref({ username: "", avatar: fixedAvatar });

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  user.value.username = storedUser.name || "Korisnik";
  user.value.avatar = fixedAvatar;
});

const logout = () => {
  if (confirm("Jeste li sigurni da želite odjaviti korisnika?")) {
    localStorage.clear();
    window.location.href = "/";
  }
};
</script>

<style scoped>
.user-header-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: 0.6rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #70fcfb;
}

.username {
  margin-left: 10px;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #111;
}

.logout-btn {
  background-color: #5f6f7f;
  color: white;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  padding: 5px 16px;
  
}

</style>
