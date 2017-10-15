import * as firebase from 'firebase'

export default {
  state: {
    loadedItems: []
  },
  mutations: {
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
    }
  },
  actions: {
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
    }
  }
}
