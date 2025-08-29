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
            class="text-h5 font-weight-bold text-center card-title"
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
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.action-card:hover {
  background:  #42CFEA;
  color: #0D0D0D;
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #133634;
  transition: color 0.3s ease;
}

.action-card:hover .card-title {
  color: #0D0D0D;
}
</style>
