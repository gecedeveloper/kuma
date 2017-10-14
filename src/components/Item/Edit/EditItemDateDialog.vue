<template>
  <v-dialog width="350px" persistent v-model="editDialog">
      <v-btn accent slot="activator">
          Editar Fecha
      </v-btn>
      <v-card>
          <v-container>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-title>Editar Fecha del Producto</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-date-picker v-model="editedDate" style="width: 100%">
                          <template scope="{save, cancel}">
                              <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Cancelar</v-btn>
                              <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Guardar</v-btn>
                          </template>
                      </v-date-picker>
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
      editedDate: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.item.date)
      const newDay = new Date(this.editedDate).getUTCDate()
      const newMonth = new Date(this.editedDate).getUTCMonth()
      const newYear = new Date(this.editedDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)
      this.$store.dispatch('updateItemData', {
        id: this.item.id,
        date: newDate
      })
    }
  },
  created () {
    this.editedDate = new Date(this.item.date)
  }
}
</script>
