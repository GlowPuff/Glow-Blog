<template>
  <div class="thumb-container">
    <div
      @click.prevent="toggled=!toggled;hover=toggled"
      class="gallery-item"
      :style="{'background-image':'url(' + source + ')'}"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div v-if="busy" class="busyoverlay"></div>
      <transition name="hover">
        <div v-if="hover || busy || toggled" class="command-popup">
          <button
            @click.prevent="onDelete"
            :class="['button', 'button-small', 'is-danger',{'is-loading':busy}]"
          >Delete</button>
        </div>
      </transition>
    </div>
    <h1 class="subtitle is-size-6 has-white">{{name}}</h1>
  </div>
</template>

<script>
export default {
  props: ["source"],
  data() {
    return {
      hover: false,
      busy: false,
      toggled: false
    };
  },
  computed: {
    name() {
      return this.source.slice(this.source.lastIndexOf("/") + 1);
    }
  },
  methods: {
    async onDelete() {
      this.busy = true;
      try {
        await this.$blogapi.deleteImage(this.name);
        this.$emit("deleteImage");
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.busyoverlay {
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.gallery-item {
  width: 125px;
  height: 100px;
  border: 1px solid #5a71a4;
  margin-bottom: 5px;
  border-radius: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.command-popup {
  background-color: rgba(255, 0, 0, 0.25);
  height: 50px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  z-index: 15;
}

.thumb-container {
  margin-left: 1rem;
  overflow: visible;
  margin-bottom: 2rem;
}

.hover-enter-active,
.hover-leave-active {
  transition: 0.5s ease;
}

.hover-leave,
.hover-enter-to {
  bottom: 0;
}

.hover-enter,
.hover-leave-to {
  bottom: -50px;
}
</style>