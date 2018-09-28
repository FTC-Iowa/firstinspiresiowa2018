import VueFire from "vuefire";
import Firebase from "./firebase";

export default {
  install(Vue) {
    const firebase = Firebase.Firebase;
    Vue.prototype.$firebase = Firebase.Firebase;
    Vue.prototype.$db = Firebase.firestore;
    Vue.prototype.$storage = Firebase.firestorage;
    Vue.prototype.$functions = Firebase.firefunctions;
    Vue.prototype.$auth = Firebase.fireauth;

    Vue.use(VueFire);

    Vue.mixin({
      computed: {
        db() {
          return this.$store.state.firestore.docs;
        }
      },
      methods: {
        dbSub(ref, watch) {
          if (watch) {
            this.$watch(
              ref,
              function(newVal, oldVal) {
                if (oldVal) {
                  this.$store.dispatch("unsubscribe", oldVal);
                }
                if (newVal) {
                  this.$store.dispatch("subscribe", newVal);
                }
              },
              { immediate: true }
            );
          } else {
            this.$store.dispatch("subscribe", ref);
          }
        },
        dbUnSub(ref) {
          this.$store.dispatch("unsubscribe", ref);
        }
      },
      mounted() {
        if (this.dbRefs) {
          this.dbRefs.forEach(ref => {
            this.dbSub(ref, true);
          });
        }
      },
      beforeDestroy() {
        if (this.dbRefs) {
          this.dbRefs.forEach(ref => {
            this.dbUnSub(this[ref]);
          });
        }
      }
    });
  }
};
