<template>
  <v-app-bar
      color="transparent"
      dark
      flat
      app
      style="backdrop-filter: blur(10px); padding: 0 24px;" >
  <v-toolbar-title class="logo">AI Učitelj</v-toolbar-title>

  <!-- Spacer -->
  <v-spacer></v-spacer>

  <!-- Desktop links -->
  <v-btn text class="nav-link" to="/">Home</v-btn>
  <v-btn text class="nav-link" to="/uploadpdf">Učitaj Skriptu</v-btn>
  <v-btn class="nav-btn" to="/login">Sign In</v-btn>

  <!-- Mobile hamburger -->
  <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>

  <!-- Mobile drawer -->
  <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      right
  >
    <v-list>
      <v-list-item class="nav-link" to="/" @click="drawer = false">Home</v-list-item>
      <v-list-item class="nav-link" to="/uploadpdf" @click="drawer = false">Učitaj Skriptu</v-list-item>
      <v-list-item class="nav-btn" to="/login" @click="drawer = false">Sign In</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {ref} from 'vue'

const drawer = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #70FCFB;
}

.nav-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #fff;
  text-transform: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #42CFEA;
}

.nav-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #0D0D0D;
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  text-transform: none;
  padding: 8px 20px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  transform: translateY(-2px) scale(1.05);
  background: linear-gradient(135deg, #42CFEA, #70FCFB);
  box-shadow: 0 8px 25px rgba(112, 252, 251, 0.7);
}
</style>
