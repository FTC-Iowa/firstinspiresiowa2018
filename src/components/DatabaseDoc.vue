<template>
  <div v-if="debug">
    {{JSON.stringify(doc)}}
  </div>
</template>

<script>
export default {
  name: "DatabaseDoc",
  props: ["id", "value", "collection", "debug"],
  data: () => ({
    dbRefs: ["dbRef"]
  }),
  computed: {
    dbRef() {
      return (this.collection ? this.collection + "/" : "") + this.id;
    },
    doc() {
      return this.db[this.dbRef];
    }
  },
  watch: {
    doc: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>

<style>
</style>
