<template>
  <v-dialog width="350px" persistent v-model="editDialog">
      <v-btn fab accent slot="activator">
          <v-icon>edit</v-icon>
      </v-btn>
      <v-card>
          <v-container>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-title>Editar Producto</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-text>
                          <v-text-field
                            name="name"
                            label="Nombre del Producto"
                            id="name"
                            v-model="editedName"
                            required></v-text-field>
                            
                            <v-text-field
                            name="price"
                            label="Precio"
                            id="price"
                            type="number"
                            suffix="PEN"
                            v-model="editedPrice"
                            required></v-text-field>

                            <v-text-field
                            name="description"
                            label="Descripción"
                            id="description"
                            v-model="editedDescription"
                            multi-line
                            required></v-text-field>
                      </v-card-text>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-actions>
                          <v-btn flat class="blue--text darken-1" @click="editDialog = false">Cancelar</v-btn>
                          <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Guardar</v-btn>
                      </v-card-actions>
                  </v-flex>
              </v-layout>
          </v-container>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      editDialog: false,
      editedName: this.item.name,
      editedPrice: this.item.price,
      editedDescription: this.item.description
    }
  },
  methods: {
    onSaveChanges () {
      if (this.editedName.trim() === '' || this.editedDescription.trim() === '') {
        return
      }
      this.editDialog = false
      this.$store.dispatch('updateItemData', {
        id: this.item.id,
        name: this.editedName,
        price: this.editedPrice,
        description: this.editedDescription
      })
    }
  }
}
</script>

