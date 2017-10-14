<template>
  <v-container>
    <v-layout row>
      <v-flex xd12 sm6 offset-sm3>
        <h4 class="primary--text">Crear Producto</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateItem">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="name"
                label="Nombre del Producto"
                id="name"
                :counter="50"
                v-model="name"
                :rules="[
                  () => !!name && name.length <= 50 || 'Máx. 50 caracteres'
                ]"
                required></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                name="price"
                label="Precio"
                id="price"
                type="number"
                suffix="PEN"
                v-model="price"
                required></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn raised class="primary" @click="onPickFile">Seleccionar Imagen</v-btn>
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <img :src="imageUrl" height="150">
            </v-flex>
          </v-layout>
          
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                name="description"
                label="Descripción"
                id="description"
                multi-line
                v-model="description"
                required></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h4>Fecha de Expiración</h4>
            </v-flex>
          </v-layout>

          <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>
                <v-date-picker v-model="date"></v-date-picker>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-time-picker v-model="time" format="24hr"></v-time-picker>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn class="primary" :disabled="!formIsValid" type="submit">Crear</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      price: '',
      imageUrl: '',
      description: '',
      date: new Date(),
      time: new Date(),
      image: null
    }
  },
  computed: {
    formIsValid () {
      return this.name !== '' && this.price !== '' && this.imageUrl !== '' && this.name.length <= 50
    },
    submitableDateTime () {
      const date = new Date(this.date)
      console.log(date)
      if (typeof this.time === 'string') {
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
      } else {
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
      }
      return date
    }
  },
  methods: {
    onCreateItem () {
      if (!this.formIsValid) {
        return
      }
      if (!this.image) {
        return
      }
      const itemData = {
        name: this.name,
        price: this.price,
        image: this.image,
        description: this.description,
        date: this.submitableDateTime
      }
      this.$store.dispatch('createItem', itemData)
      this.$router.push('/items')
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid image')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>
