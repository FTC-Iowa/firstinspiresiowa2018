<template>
    <span>
        {{ date }}
    </span>
</template>

<script>
var dateFormat = require("dateformat");

export default {
  name: "DateFormat",
  props: ["time"],
  data: () => ({
    //date: ""
  }),
  computed: {
    date: function() {
      if (this.time.seconds) {
        return dateFormat(this.time.seconds * 1000, "mmmm dS, yyyy");
      } else {
        console.log("time: ", this.time);
        return "error";
      }
    }
  }
};
</script>

<style>
</style>
