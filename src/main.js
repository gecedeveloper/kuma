import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditItemDetailsDialog from './components/Item/Edit/EditItemDetailsDialog.vue'
import EditItemDateDialog from './components/Item/Edit/EditItemDateDialog.vue'
import EditItemTimeDialog from './components/Item/Edit/EditItemTimeDialog.vue'
import RegisterDialog from './components/Item/Registration/RegisterDialog.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-item-details-dialog', EditItemDetailsDialog)
Vue.component('app-edit-item-data-dialog', EditItemDateDialog)
Vue.component('app-edit-item-time-dialog', EditItemTimeDialog)
Vue.component('app-item-register-dialog', RegisterDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBPccPSRAbOVSOxIbXzLq83ycha_RHbz2U',
      authDomain: 'kuma-8561f.firebaseapp.com',
      databaseURL: 'https://kuma-8561f.firebaseio.com',
      projectId: 'kuma-8561f',
      storageBucket: 'gs://kuma-8561f.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
    this.$store.dispatch('loadItems')
  }
})
