<template>
  <v-dialog v-model="modelValue" max-width="500px">
    <v-card>
      <v-card-title class="headline">Upload PDF</v-card-title>
      <v-card-text>
        <!-- Ime PDF-a -->
        <v-text-field
            v-model="pdfName"
            label="Ime PDF dokumenta"
            outlined
            required
        ></v-text-field>

        <!-- Odabir PDF datoteke -->
        <v-file-input
            v-model="file"
            label="Odaberi PDF dokument"
            accept=".pdf"
            prepend-icon="mdi-file-pdf"
            outlined
        ></v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="handleUpload" :loading="loading">
          Pošalji
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'


const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'uploaded'])

const pdfName = ref('')
const file = ref(null)
const loading = ref(false)

watch(() => props.modelValue, val => {
  if (!val) {
    pdfName.value = ''
    file.value = null
  }
})

const handleUpload = async () => {
  if (!file.value) return alert('Odaberi PDF datoteku!')
  if (!pdfName.value.trim()) return alert('Unesi ime PDF-a!')

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('name', pdfName.value)

    // Dohvati token (gost ili korisnik)
    const token = localStorage.getItem('token') || localStorage.getItem('guestToken')
    if (!token) throw new Error('Niste prijavljeni')

    const isGuest = !!localStorage.getItem('guestToken')
    const url = isGuest
        ? 'http://localhost:5000/gost/upload'
        : 'http://localhost:5000/pdf/upload'

    const res = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    })

    // Emituj podatke natrag roditelju
    emit('uploaded', res.data)
    emit('update:modelValue', false)
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Greška pri uploadu PDF-a')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
