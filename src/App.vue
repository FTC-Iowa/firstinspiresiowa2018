<template>
  <fullscreen ref="fullscreen" @change="fullscreenChange">
    <v-app  :dark="darkTheme">
      <v-navigation-drawer
        persistent
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        enable-resize-watcher
        fixed
        app
        class="hidden-md-and-down"
      >
        <v-list>
          <v-list-tile
            value="true"
            v-for="(item, i) in items"
            :key="i"
            :to="{name: item.name}"
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title">test</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        app
        :clipped-left="clipped"
        color="primary"
        tabs
      >
        <color-bars />
        <v-tabs
          v-if="tabs.length > 0 && !$vuetify.breakpoint.mdAndDown"
          slot="extension"
          v-model="value"
          color="primary"
          slider-color="secondary"
          centered
          show-arrows
        >
            <!-- :href="'#' + tab" -->
          <v-tab 
            v-for="tab in tabs" 
            :key="tab"
            fixed
            :to="tab" 
          >
            {{ tab }}
          </v-tab>
        </v-tabs>

        <!-- <v-toolbar-side-icon 
          color="secondary"
          flat
          icon
          @click.stop="drawer = !drawer"
        /> -->
        <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
          <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-btn icon @click.stop="clipped = !clipped">
          <v-icon>web</v-icon>
        </v-btn>
        <v-btn icon @click.stop="fixed = !fixed">
          <v-icon>remove</v-icon>
        </v-btn> -->
        <v-toolbar-title 
          v-text="title"
          color="secondary"
        />
        <v-spacer />
        <v-btn 
          flat 
          icon
          small
          @click="darkTheme = !darkTheme"
        >
          <v-icon>invert_colors</v-icon>
        </v-btn>
        <v-btn 
          flat 
          icon
          small
          @click="toggleFullscreen"
        >
          <v-icon v-if="fullscreen">fullscreen_exit</v-icon>
          <v-icon v-else>fullscreen</v-icon>
        </v-btn>

        <v-menu 
          bottom
          left
        >
          <v-btn
            slot="activator"
            flat 
            icon
            small
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(item, i) in menuItems" :key="i" close-on-click close-on-content-click lazy>
              <v-list-tile-title>
                <component :is="item" />
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        
        <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-icon>menu</v-icon>
        </v-btn> -->
      </v-toolbar>
      <v-content>
        <router-view @setTabs="setTabs" v-model="value"/>
      </v-content>
      <!-- <v-navigation-drawer
        temporary
        :right="right"
        v-model="rightDrawer"
        fixed
        app
      >
        <v-list>
          <v-list-tile @click="right = !right">
            <v-list-tile-action>
              <v-icon>compare_arrows</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer> -->
      <v-bottom-nav 
        app
        fixed
        :value="true"
        :active.sync="bottomNav"
        class="hidden-lg-and-up"
        color="primary"
      >
        <v-btn 
          flat 
          color="secondary" 
          v-for="(item, i) in items"
          :key="i"
          :to="{name: item.name}"
        >
          <span>{{item.title}}</span>
          <v-icon>{{item.icon}}</v-icon>
        </v-btn>
      </v-bottom-nav>
      <!-- <v-card height="200px">
          
        </v-card> -->
      <!-- <v-footer :fixed="fixed" app>
        
        
      </v-footer> -->
    </v-app>
  </fullscreen>
</template>

<script>
import fullscreen from "vue-fullscreen";
import Vue from "vue";
Vue.use(fullscreen);

import ColorBars from "@/components/ColorBars";
import LogIn from "@/components/MenuItems/LogIn";
import UploadEvent from "@/components/MenuItems/UploadEvent";
import ImportTeams from "@/components/MenuItems/ImportTeams";

export default {
  name: "App",
  components: {
    ColorBars,
    UploadEvent,
    ImportTeams
  },
  data() {
    return {
      value: "",
      darkTheme: false,
      clipped: true,
      drawer: true,
      fixed: false,
      bottomNav: 1,
      fullscreen: false,
      items: [
        {
          icon: "home",
          title: "Home",
          name: "home"
        },
        {
          icon: "people",
          title: "Teams",
          name: "teams"
        },
        {
          icon: "event",
          title: "Events",
          name: "events"
        },
        {
          icon: "group_work",
          title: "Leagues",
          name: "leagues"
        }
      ],
      tabs: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "FIRST Inspires Iowa",
      menuItems: [LogIn, ImportTeams, UploadEvent]
    };
  },
  methods: {
    toggleFullscreen() {
      this.$refs["fullscreen"].toggle();
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen;
    },
    setTabs(tabs) {
      // console.log("setTabs:", tabs);
      this.tabs = tabs;
    },

    uploadEvent() {
      console.log("upload event");
      this.$refs.uploadEvent.show();
    },

    importTeams() {
      console.log("import teams");
      this.$refs.importTeams.show();
    }
  }
};
</script>

<style>
.v-toolbar__content {
  padding-top: 5px !important;
}
.v-toolbar__extension {
  padding: 0;
}
</style>
