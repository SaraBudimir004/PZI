<template>
  <v-navigation-drawer
      app
      width="260"
      class="side-nav"
  >
    <v-list dense>
      <!-- Logo -->
      <v-list-item class="logo">
        <span class="text-h6 font-weight-bold">Skripte</span>
      </v-list-item>

      <!-- Upload nova skripta -->
      <v-list-item
          link
          @click="$emit('upload-click')"
          class="upload-sidebar-item"
      >
        <v-list-item-icon>
          <v-icon color="primary">mdi-upload</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">Učitaj novu skriptu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Lista PDF-ova -->
      <v-list-item
          v-for="pdf in userPdfs"
          :key="pdf.id"
          link
          @click="$emit('pdf-select', pdf)"
          @contextmenu.prevent="showContextMenu($event, pdf.id)"
          :class="{'pdf-item-selected': pdf.id === selectedPdfId}"
      >
        <v-list-item-icon>
          <v-icon color="red lighten-1">mdi-file-pdf</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="d-flex justify-space-between align-center">
          <span class="truncate-text">{{ pdf.name }}</span>
          <span class="pdf-pages text-caption grey--text text--darken-1">
              Stranice: {{ pdf.totalPages || 0 }}
            </span>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Custom context menu -->
    <div
        v-if="contextMenu.visible"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
        class="custom-context-menu"
        @click="handleContextDelete"
    >
      Delete
    </div>
    <div v-if="contextMenu.visible" class="overlay" @click="hideContextMenu"></div>

  </v-navigation-drawer>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "Sidebar",
  props: {
    userPdfs: {
      type: Array,
      default: () => []
    },
    selectedPdfId: {
      type: String,
      default: null
    }
  },
  emits: ["pdf-select", "upload-click", "pdf-deleted"],
  setup(props, { emit }) {

    const contextMenu = ref({
      visible: false,
      x: 0,
      y: 0,
      pdfId: null
    });

    const showContextMenu = (event, pdfId) => {
      contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        pdfId
      };
    };

    const hideContextMenu = () => {
      contextMenu.value.visible = false;
    };

    const handleContextDelete = () => {
      if (contextMenu.value.pdfId) {
        deletePdf(contextMenu.value.pdfId);
      }
      hideContextMenu();
    };

    const deletePdf = async (pdfId) => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Molimo prijavite se");

      if (!confirm("Jeste li sigurni da želite obrisati ovaj PDF?")) return;

      try {
        await axios.delete(`http://localhost:5000/pdf/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Emit događaj da Dashboard zna da je PDF obrisan
        emit("pdf-deleted", pdfId);

      } catch (err) {
        console.error("Greška pri brisanju PDF-a:", err);
        alert("Greška pri brisanju PDF-a.");
      }
    };

    return { deletePdf, showContextMenu, hideContextMenu, contextMenu, handleContextDelete };
  }
};
</script>

<style scoped>
.side-nav {
  background: #c9c7c7;
  border-right: 1px solid #e6f0f3;
  border-radius: 0 16px 16px 0;
  padding-top: 20px;
  color: #2c3e50;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

/* Logo */
.logo {
  margin-bottom: 20px;
  padding-left: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #2c3e50;
}

/* Upload dugme */
.upload-sidebar-item {
  border-radius: 10px;
  margin: 8px 12px;
  padding: 10px;
  transition: all 0.25s ease;
  color: #2c3e50;
  font-weight: 600;
}

.upload-sidebar-item:hover {
  background: rgba(66, 207, 234, 0.12);
  color: #2f93a8;
  transform: translateX(4px);
}

/* PDF item */
.v-list-item {
  margin: 4px 8px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background: rgba(112, 252, 251, 0.08);
}

.pdf-item-selected {
  background: rgba(66, 207, 234, 0.15);
  border-left: 4px solid #2f93a8;
  border-radius: 0 10px 10px 0;
}

/* Naziv PDF-a */
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}

/* Stranice PDF-a */
.pdf-pages {
  color: #5f6f7f;
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
}

/* Context menu */
.custom-context-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  transition: all 0.2s ease;
}

.custom-context-menu:hover {
  background: rgba(66, 207, 234, 0.12);
  color: #2f93a8;
}
  
</style>
