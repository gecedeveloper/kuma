<template>
    <v-container>

        <v-layout row wrap>
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn large router to="/items" class="info"> Explorar Productos</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center text-sm-left">
                <v-btn large router to="/item/new" class="info"> Organizar Productos</v-btn>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :width="7" :size="70" v-if="loading"></v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-2" v-if="!loading">
            <v-flex xs12>
                <v-carousel style="cursor: pointer;">
                    <v-carousel-item v-for="item in items" v-bind:src="item.imageUrl" :key="item.id" @click="onLoadProduct(item.id)">
                        <div class="title">{{ item.name }}</div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-2">
            <v-flex xs12 class="text-xs-center">
                <p>Join our awesome meetups</p>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
export default {
  computed: {
    items () {
      return this.$store.getters.featuredItems
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadProduct (id) {
      this.$router.push('/items/' + id)
    }
  }
}
</script>

<style scoped>
.title{
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 2em;
    padding: 20px;
}
</style>
