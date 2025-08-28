<template>
  <v-row>
    <v-col
        v-for="card in cards"
        :key="card.id"
        cols="12"
        md="6"
        class="mb-4"
    >
      <v-card
          class="pa-10 action-card"
          :style="{ cursor: card.onClick ? 'pointer' : 'default' }"
          @click="card.onClick && card.onClick()"
      >
        <div
            class="text-h5 font-weight-bold text-center"
            style="color:#133634;"
        >
          {{ card.title }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DashboardCards",
  props: {
    uploadedPdf: { type: Object, required: true }
  },
  emits: ["open-pdf-viewer", "open-flashcards", "open-quiz", "open-summary"],
  setup(props, { emit }) {
    const cards = [
      {
        id: 1,
        title: "Flashcards",
        onClick: () => emit("open-flashcards", props.uploadedPdf.id)
      },
      {
        id: 2,
        title: "Kviz",
        onClick: () => emit("open-quiz", props.uploadedPdf.id)
      },
      {
        id: 3,
        title: "Sažetak Pdf-a",
        onClick: () => emit("open-summary", props.uploadedPdf.id)
      },
      {
        id: 4,
        title: "Pregledaj Pdf",
        onClick: () => emit("open-pdf-viewer", props.uploadedPdf.id)
      }
    ];

    return {cards};
  }
};
</script>

<style scoped>
.action-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}
</style>
