<template>
  <v-dialog
      v-model="dialog"
      max-width="90vw"
      max-height="90vh"
  >
    <v-card style="position: relative;">
      <v-card-title class="headline grey lighten-2">
        {{ title }}
        <v-spacer></v-spacer>
      </v-card-title>

      <!-- Close button u gornjem desnom kutu -->
      <v-btn icon @click="close" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-text style="height: 80vh;" class="pdf-container">
        <VuePdfEmbed
            v-if="pdfSource"
            :source="pdfSource"
            style="width: 100%; height: 100%;"
            annotation-layer
            text-layer
            image-resources-path="https://unpkg.com/pdfjs-dist/web/images/"
        />
        <div v-else-if="textContent" class="pa-4" style="overflow-y:auto;">
          <pre>{{ textContent }}</pre>
        </div>
        <div v-else class="text-center pa-10">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p>Učitavanje...</p>
        </div>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";

export default {
  name: "PdfView",
  components: {VuePdfEmbed},
  props: {
    pdfSource: {type: [String, Object], required: true},
    title: {type: String, default: "Pregled PDF-a"},
    show: {type: Boolean, default: false},
    textContent: { type: String, default: "" },
  },
  emits: ["update:show"],
  data() {
    return {dialog: this.show};
  },
  watch: {
    show(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("update:show", val);
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.pdf-container .canvasWrapper {
  margin: 16px 0;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pdf-container .textLayer {
  padding: 8px;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
}
</style>
