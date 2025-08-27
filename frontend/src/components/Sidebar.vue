<template>
  <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      clipped
      width="250"
  >
    <v-list>
      <v-list-item
          v-for="(script, index) in scripts"
          :key="index"
          @click="selectScript(index)"
          :class="{ selected: selectedScriptIndex === index }"
      >
        <v-list-item-content>
          <v-list-item-title>{{ script.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  drawer: Boolean,
  scripts: Array,
  selectedScriptIndex: Number
})
const emit = defineEmits(['update:drawer', 'select'])

const selectScript = (index) => {
  emit('select', index)
  emit('update:drawer', false)
}
</script>

<style scoped>
.selected {
  background: linear-gradient(135deg, #70FCFB, #42CFEA);
  color: #0D0D0D;
  border-radius: 12px;
}
</style>
