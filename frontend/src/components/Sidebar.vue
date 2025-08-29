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
  background: #f5f9fa;
  border-radius: 0 20px 20px 0;
  padding-top: 20px;
}

.logo {
  margin-bottom: 20px;
  padding-left: 16px;
}

.upload-sidebar-item {
  border-radius: 12px;
  margin: 8px;
  padding: 8px;
  transition: all 0.2s;
}

.upload-sidebar-item:hover {
  background-color: rgba(66, 207, 234, 0.15);
}

.pdf-item-selected {
  background-color: rgba(0, 150, 136, 0.15);
  border-left: 4px solid #009688;
  border-radius: 0 12px 12px 0;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-x-btn {
  min-width: auto;
  padding: 0;
}

/* Context menu */
.custom-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 1000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
}
</style>
