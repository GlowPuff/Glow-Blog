<template>
  <div class="has-navbar-fixed-top">
    <nav id="navbar" class="navbar is-fixed has-shadow">
      <div class="navbar-brand">
        <a href class="navbar-item has-text-weight-bold">GlowBlog</a>
        <a
          @click.prevent="burgerclick"
          :class="[{'is-active':sideactive},'burger','navbar-burger']"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
    </nav>

    <div style="position:relative;">
      <!-- Notification popup -->
      <transition name="notify">
        <div
          v-if="isNotified"
          :class="['notifier', {'notify-error':isNotifyError}]"
        >{{notifiermessage}}</div>
      </transition>

      <!-- side menu -->
      <SideMenu
        :sideactive="sideactive"
        menuLabel="content"
        :menuActions="menuActions"
        v-on:toggleSettings="onShowSettings"
        v-on:onLogout="onLogout"
        v-on:create="onCreatePost"
        v-on:gallery="onShowGallery"
      ></SideMenu>

      <transition name="overlay">
        <div v-if="sideactive" @click="sideactive=false" class="overlay"></div>
      </transition>

      <!-- content area -->
      <div class="mycontent">
        <div class="dummy-column"></div>
        <Settings v-if="showSettings" v-on:closeSettings="onCloseSettings"></Settings>
        <!-- swap component for whichever is active -->
        <!-- keep-alive -->
        <component
          v-show="!showSettings"
          v-bind:is="activeComponent"
          v-on:createPost="onCreatePost"
          v-on:editPost="onEditPost"
          v-on:closePost="onClosePost"
          v-on:closeGallery="onCloseGallery"
          v-on:notify="onNotify"
          v-bind:dynamicProperties="dynamicProperties"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import Settings from "@/components/Settings.vue";
import SideMenu from "@/components/SideMenu.vue";
import PostList from "@/components/PostList.vue";
import Editor from "@/components/Editor.vue";
import Gallery from "@/components/Gallery.vue";

export default {
  name: "Dashboard",
  components: {
    PostList,
    Settings,
    SideMenu,
    Editor,
    Gallery
  },
  computed: {
    dynamicProperties() {
      if (this.activeComponent === Editor) {
        return { post: this.selectedPost, mode: this.mode };
      } else return {};
    },
    menuActions() {
      if (this.mode === "dashboard")
        return [
          {
            label: "New Post",
            actionName: "create",
            icon: "fas fa-plus-square"
          },
          {
            label: "Image Gallery",
            actionName: "gallery",
            icon: "fas fa-images"
          }
        ];
      // else if (this.mode === "gallery")
      //   return [
      //     {
      //       label: "New Post",
      //       actionName: "create",
      //       icon: "fas fa-plus-square"
      //     }
      //   ];
      else return [];
    }
  },
  data() {
    return {
      selectedPost: {},
      mode: "dashboard",
      isNotified: false,
      isNotifyError: false,
      notifiermessage: "",
      sideactive: false,
      showSettings: false,
      activeComponent: "PostList"
    };
  },
  methods: {
    onNotify(data) {
      this.isNotifyError = data.isError;
      this.notifiermessage = data.message;
      this.isNotified = true;
      setTimeout(() => {
        this.isNotified = false;
      }, 2500);
    },
    burgerclick() {
      this.sideactive = !this.sideactive;
    },
    onCreatePost() {
      this.selectedPost = {};
      this.sideactive = false;
      this.mode = "create";
      this.activeComponent = Editor;
    },
    onEditPost(postData) {
      this.sideactive = false;
      this.mode = "edit";
      this.selectedPost = postData;
      this.activeComponent = Editor;
    },
    onClosePost() {
      this.activeComponent = PostList;
      this.mode = "dashboard";
    },
    onShowGallery() {
      this.sideactive = false;
      this.showSettings = false;
      // this.mode="gallery";
      this.activeComponent =
        this.activeComponent !== Gallery ? Gallery : PostList;
    },
    onCloseGallery() {
      this.activeComponent = PostList;
      this.mode = "dashboard";
    },
    onShowSettings() {
      this.sideactive = false;
      this.showSettings = !this.showSettings;
    },
    onCloseSettings() {
      this.showSettings = false;
    },
    onLogout() {
      this.sideactive = false;
			let self = this;
			// console.log(firebase);
			// return;
      firebase.auth()
        .signOut()
        .then(function() {
          self.$router.push("/login");
        })
        .catch(function(error) {
          console.log("Sign out error: " + error);
        });
    }
  }
};
</script>

<style scoped>
.notify-enter-active,
.notify-leave-active {
  transition: 1s;
}

.notify-enter,
.notify-leave-to {
  bottom: -60px !important;
}

.notify-leave,
.notify-enter-to {
  bottom: 0px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: 1s;
}

.fade-leave,
.fade-enter-to {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
