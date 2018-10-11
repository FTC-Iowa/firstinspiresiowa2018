<template>
  <v-speed-dial
      v-model="fab"
      :top="false"
      :bottom="true"
      :right="true"
      :left="false"
      direction="top"
      :open-on-hover="false"
      transition="slide-y-reverse-transition"
      :fixed="true"
    >
      <v-btn
        slot="activator"
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>apps</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-card class="fab-button-list" color="transparent">
        <v-container grid-list-md fluid>
          <v-layout row wrap v-if="items">
            <v-flex
              v-for="(item, i) in items"
              :key="i"
              xs6
            >
                <v-btn 
                  color="secondary" 
                  block 
                  large 
                  :to="{name: item.route}"
                >
                  <v-icon left>{{item.icon}}</v-icon>
                  {{item.name}}
                </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-speed-dial>
</template>

<script>
export default {
  name: "FabMenu",
  props: ["items"],
  data: () => ({
    fab: false
  })
};
</script>

<style scoped lang="scss">
.v-speed-dial--bottom {
  bottom: 70px;
  left: 16px;
  text-align: right;
}

.fab-button-list {
  width: 100%;
}

.transparent {
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
