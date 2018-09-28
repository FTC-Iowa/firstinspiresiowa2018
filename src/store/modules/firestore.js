import Vue from "vue";

import Firebase from "@/plugins/firebase/firebase";
const db = Firebase.firestore;

const state = {
  docs: {},
  ids: {}
};

const mutations = {
  subscribe(state, { ref, unsub }) {
    if (state.ids[ref]) {
      state.ids[ref].cnt++;
    } else {
      state.ids[ref] = { cnt: 1, unsub: unsub };
    }
  },

  unsubscribe(state, ref) {
    if (state.ids[ref]) {
      state.ids[ref].cnt--;
      if (state.ids[ref].cnt <= 0) {
        if (state.ids[ref].unsub) {
          state.ids[ref].unsub();
          // todo, add timeout before deleting data
          Vue.set(state.docs, ref, null);
        } else {
          console.error("couldn't unsub from " + ref);
        }
      }
    }
  },

  updateDoc(state, { ref, data }) {
    Vue.set(state.docs, ref, data);
  }
};

const actions = {
  subscribe({ commit, state }, ref) {
    if (state.ids[ref] && state.ids[ref].cnt > 0) {
      commit("subscribe", { ref: ref });
    } else {
      var unsub = db.doc(ref).onSnapshot(doc => {
        if (doc.exists) {
          var data = doc.data();
          data.id = doc.id;
          commit("updateDoc", { ref: ref, data: data });
        }
      });

      commit("subscribe", { ref: ref, unsub: unsub });
    }

    // console.log('Vue: ', Vue)
  },

  unsubscribe({ commit }, ref) {
    setTimeout(() => {
      // wait a little while before actually unsubscribing incase we still need the data
      commit("unsubscribe", ref);
    }, 600000); // 10 minute
  }
};

const getters = {
  getFirestoreDoc: state => ref => {
    return state.docs[ref];
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
