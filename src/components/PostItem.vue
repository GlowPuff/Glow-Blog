<template>
  <div class="mycell" style="position:relative;">
    <div v-if="busy" class="minioverlay"></div>
    <div class="grow">
      <p class="title is-6 has-text-white">
        {{post.title}}
        <span v-if="post.isDraft" class="tag is-warning">Draft</span>
      </p>
      <p class="subtitle is-7 has-text-white">{{post.publishedAt}}</p>
    </div>

    <div class="cell-right">
      <button @click.prevent="onEdit" class="button is-success" style="margin-right:1rem;">Edit</button>
      <button @click.prevent="onDelete" :class="['button', 'is-danger',{'is-loading':busy}]">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostItem",
  props: ["post"],
  data() {
    return {
      busy: false
    };
  },
  methods: {
    onEdit() {
      this.$emit("editPost", this.post);
    },
    async onDelete() {
      this.busy = true;

      try {
        await this.$blogapi.deletePost(this.post.postID);

        this.busy = false;
        this.$emit("deletePost", {
          result: true
        });
      } catch (error) {
        this.busy = false;
        this.$emit("deletePost", {
          result: false,
          errorMessage: error.message
        });
      }
    }
  }
};
</script>

<style scoped>
.minioverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(219, 38%, 9%, 0.75);
  z-index: 5;
  border-radius: 5px;
}

@media (max-width: 450px) {
  .grow {
    width: 100%;
  }
}
</style>