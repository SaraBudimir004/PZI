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
        <v-btn small color="#FF5733" dark @click="close">Zatvori</v-btn>
      </v-card-title>

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
          <p>Učitavanje...</p>
          <v-btn color="#FF5733" dark @click="close">Zatvori</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";

const props = defineProps({
  pdfSource: { type: [String, Object], required: true },
  title: { type: String, default: "Pregled PDF-a" },
  show: { type: Boolean, default: false },
  textContent: { type: String, default: "" }
});

const emit = defineEmits(["update:show"]);

const dialog = ref(props.show);

watch(() => props.show, (val) => {
  dialog.value = val;
});

watch(dialog, (val) => {
  emit("update:show", val);
});

const close = () => {
  dialog.value = false;
};
</script>

<style scoped>
.pdf-container{
  margin: 16px 0;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pdf-container{
  padding: 8px;
}

</style>
