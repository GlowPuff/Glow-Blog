<template>
  <div class="childcontent">
    <h1 class="title">Dashboard Home</h1>
    <h1 v-if="!busy" class="subtitle">Post Count: {{postCount}}</h1>

    <div v-if="busy" id="busycontainer">
      <i class="fas fa-3x fa-spinner spinner"></i>
    </div>
    <div v-else>
      <div class="notification actionnotification">
        <div class="actionbar">
          <button @click.prevent="onCreate" class="button is-success">New Post</button>
          <button
            @click.prevent="refreshButton"
            class="button is-warning is-rounded"
            style="padding-top:.5rem;"
          >
            <i class="fas fa-redo"></i>
          </button>
        </div>
      </div>

      <div v-if="postCount>0" class="mytable">
        <PostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
          v-on:editPost="onEditPost"
          v-on:deletePost="onDeletePost"
        ></PostItem>
      </div>

      <!-- pagination -->
      <nav class="pagination">
        <a
          :disabled="busy || pageNumber===1"
          @click.prevent="onPrevious"
          class="pagination-previous"
        >Previous</a>
        <a
          :disabled="busy || limit * pageNumber >= postCount"
          @click.prevent="onNext"
          class="pagination-next"
        >Next page</a>
      </nav>

      <!-- error box -->
      <div v-if="error" class="notification actionnotification errorbox">
        <div>
          <div>{{errorMessage}}</div>
          <div>{{errorError}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostItem from "@/components/PostItem.vue";

export default {
  components: {
    PostItem
  },
  data() {
    return {
      pageNumber: 1,
      postCount: 0,
      limit: 5,
      busy: false,
      error: false,
      errorMessage: "",
      errorError: "",
      posts: []
    };
  },
  methods: {
    onNext() {
      if (this.busy || this.limit * this.pageNumber >= this.postCount) return;
      else this.pageNumber++;
      this.refreshPosts();
    },
    onPrevious() {
      if (this.busy || this.pageNumber === 1) return;
      else this.pageNumber--;
      this.refreshPosts();
    },
    onEditPost(data) {
      this.$emit("editPost", data);
    },
    onDeletePost(result) {
      if (result.result === true)
        this.$emit("notify", { message: "post deleted", isError: false });
      else
        this.$emit("notify", {
          message: "Error deleting post: " + result.errorMessage,
          isError: true
        });
      this.refreshPosts();
    },
    onCreate() {
      this.$emit("createPost");
    },
    refreshButton() {
      this.pageNumber = 1;
      this.refreshPosts();
    },
    async refreshPosts() {
      this.posts = [];
      this.busy = true;
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let apiresult = await this.$blogapi.getPostsPaging(this.pageNumber);
        this.error = false;
        this.postCount = apiresult.data.postCount;
        this.posts = apiresult.data.posts;
        this.limit = apiresult.data.limit;
      } catch (error) {
        // console.log(err);
        this.error = true;
        this.errorMessage = error.message;
        this.errorError = error.innerMessage;
      } finally {
        this.busy = false;
      }
    }
  },
  mounted() {
    this.refreshPosts();
  }
};
</script>

<style lang="scss" scoped>
#busycontainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
</style>