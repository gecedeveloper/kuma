<template>
  <v-dialog width="350px" persistent v-model="editDialog">
      <v-btn accent slot="activator">
          Editar Hora
      </v-btn>
      <v-card>
          <v-container>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-title>Editar Hora del Producto</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-time-picker v-model="editedTime" style="width: 100%" format="24hr">
                          <template scope="{save, cancel}">
                              <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Cancelar</v-btn>
                              <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Guardar</v-btn>
                          </template>
                      </v-time-picker>
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
      editedTime: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.item.date)
      const hours = this.editedTime.match(/^(\d+)/)[1]
      const minutes = this.editedTime.match(/:(\d+)/)[1]
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      this.$store.dispatch('updateItemData', {
        id: this.item.id,
        date: newDate
      })
    }
  },
  created () {
    this.editedTime = new Date(this.item.date).toTimeString()
  }
}
</script>
