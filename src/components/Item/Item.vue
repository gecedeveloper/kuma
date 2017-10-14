<template>
  <v-container>
      <v-layout row wrap v-if="loading">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate color="primary" :width="7" :size="70"></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
          <v-flex xs12>
              <v-card>
                    <v-card-title>
                      <h6 class="primary--text">{{ item.name }}</h6>
                      <template v-if="userIsCreator">
                          <v-spacer></v-spacer>
                          <app-edit-item-details-dialog :item="item"></app-edit-item-details-dialog>
                      </template>
                    </v-card-title>
                    <v-card-media :src="item.imageUrl"
                    height="400px">
                    </v-card-media>
                    <v-card-text>
                        <div class="info--text"><v-icon class="info--text">query_builder</v-icon> {{ item.date | date }}</div>
                        <div>
                            <app-edit-item-data-dialog :item="item" v-if="userIsCreator"></app-edit-item-data-dialog>
                            <app-edit-item-time-dialog :item="item" v-if="userIsCreator"></app-edit-item-time-dialog>
                        </div>
                        <div>
                            {{ item.description }}
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <app-item-register-dialog :itemId="item.id"></app-item-register-dialog>
                    </v-card-actions>
              </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    item () {
      return this.$store.getters.loadedItem(this.id)
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsCreator () {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.item.creatorId
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>
