<template>
  <!-- Red u kojem se nalazi user header -->
  <v-row class="align-center">
    <v-col cols="12" class="d-flex justify-end align-center">
      <!-- Vuetify meni za dropdown -->
      <v-menu offset-y>
        <!-- Activator template - ovo je element koji otvara dropdown kada se klikne -->
        <template #activator="{ props, on }">
          <!-- Glavni div korisničkog headera (avatar + ime) -->
          <div v-bind="props" v-on="on" class="user-header">
            <!-- Avatar korisnika -->
            <v-avatar size="50">
              <img :src="user.avatar || defaultAvatar" alt="Korisnik" />
            </v-avatar>
            <!-- Ime korisnika -->
            <span class="username">{{ user.username || 'Korisnik' }}</span>
            <!-- Ikonica strelice dolje koja pokazuje da postoji dropdown -->
            <v-icon class="ml-1">mdi-menu-down</v-icon>
          </div>
        </template>

        <!-- Dropdown lista -->
        <v-list>
          <!-- Jedna stavka dropdowna: odjava -->
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="red">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Odjava</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "UserHeader",
  setup() {
    const router = useRouter(); // Router za navigaciju nakon odjave

    // Default avatar ako korisnik nema sliku
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Reactive objekt koji čuva korisničke podatke
    const user = ref({ username: "", avatar: "" });

    // onMounted se izvršava kada se komponenta prikaže
    onMounted(() => {
      // Dohvati korisnika iz localStorage
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      user.value.username = storedUser.name || "Korisnik";
      user.value.avatar = storedUser.avatar || defaultAvatar;
    });

    // Funkcija za logout
    const logout = () => {
      if (confirm("Jeste li sigurni da želite odjaviti korisnika?")) {
        // Briše sve podatke o korisniku iz localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("guestToken");
        localStorage.removeItem("debug");

        // Vraća korisnika na home stranicu
        window.location.href = '/';
      }
    };

    return { user, defaultAvatar, logout };
  }
};
</script>

<style scoped>
/* Glavni div za avatar + ime */
.user-header {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer; /* pokazuje da se može kliknuti */
}

/* Avatar slika */
.v-avatar img {
  border-radius: 50%; /* okrugli avatar */
  object-fit: cover; /* da slika ne bude iskrivljena */
}

/* Ime korisnika */
.username {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}
</style>
