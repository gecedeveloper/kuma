import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedItems: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.purchasedProducts.findIndex(item => item.id === id) >= 0) {
        return
      }
      state.user.purchasedProducts.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const purchasedProducts = state.user.purchasedProducts
      purchasedProducts.splice(purchasedProducts.findIndex(item => item.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedItems (state, payload) {
      state.loadedItems = payload
    },
    createItem (state, payload) {
      state.loadedItems.push(payload)
    },
    updateItem (state, payload) {
      const item = state.loadedItems.find(item => {
        return item.id === payload.id
      })
      if (payload.name) {
        item.name = payload.name
      }
      if (payload.price) {
        item.price = payload.price
      }
      if (payload.description) {
        item.description = payload.description
      }
      if (payload.date) {
        item.date = payload.date
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey).remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', payload)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    loadItems ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('items').once('value')
      .then((data) => {
        const items = []
        const obj = data.val()
        for (let key in obj) {
          items.push({
            id: key,
            name: obj[key].name,
            price: obj[key].price,
            imageUrl: obj[key].imageUrl,
            description: obj[key].description,
            date: obj[key].date,
            creatorId: obj[key].creatorId
          })
        }
        commit('setLoadedItems', items)
        commit('setLoading', false)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    createItem ({commit, getters}, payload) {
      const item = {
        name: payload.name,
        price: payload.price,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('items').push(item)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        return firebase.storage().ref('items/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        return firebase.database().ref('items').child(key).update({imageUrl})
      })
      .then(() => {
        commit('createItem', {
          ...item,
          imageUrl: imageUrl,
          id: key
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    updateItemData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.price) {
        updateObj.price = payload.price
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('items').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateItem', payload)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            purchasedProducts: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            purchasedProducts: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    clearError ({commit}) {
      commit('clearError')
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, purchasedProducts: [], fbKeys: {}})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    loadedItems (state) {
      return state.loadedItems.sort((itemA, itemB) => {
        return itemA.date > itemB.date
      })
    },
    featuredItems (state, getters) {
      return getters.loadedItems.slice(0, 5)
    },
    loadedItem (state) {
      return (itemId) => {
        return state.loadedItems.find((item) => {
          return item.id === itemId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})
