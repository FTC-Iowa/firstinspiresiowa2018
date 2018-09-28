const state = {
  auth: {},
  user: null
};

const mutations = {
  AUTH_INIT(state, auth) {
    state.auth = auth;
  },
  AUTH_LOGIN(state, user) {
    state.user = user;
  }
};

const actions = {
  AUTH_INIT({ commit }, auth) {
    commit("AUTH_INIT", auth);
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("user logged in: ", user);
        commit("AUTH_LOGIN", user);
      } else {
        console.log("user signed out");
        commit("AUTH_LOGIN", null);
      }
    });
  }
};

const getters = {
  authIsLoggedIn: state => {
    return state.user !== null;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
