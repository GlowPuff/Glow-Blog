<template>
  <div id="main">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <router-link to="/">{{title}}</router-link>
          </h1>
          <h2 class="subtitle has-text-white">{{subtitle}}</h2>
        </div>
      </div>
    </section>

    <div class="container p-1" style="width:100%;">
      <h1 class="subtitle" style="margin:0 !important;">Tag Search</h1>
      <h2 v-if="!busy" class="subtitle has-text-white">Found {{postCount}} posts with "{{tag}}"</h2>

      <section id="posts">
        <div v-for="(post,index) in posts" :key="index" class="article-box">
          <div class="article-header">
            <p class="title is-5 has-text-white">{{post.title}}</p>
            <p class="subtitle is-6" style="color:#5a71a4;">{{post.publishedAt}}</p>
          </div>
          <div class="article-body has-text-black">
            <p ref="arts" class="has-text-white">{{post.description}}</p>
          </div>
          <div class="p-1">
            <a
              v-for="(t,idx) in post.tags"
              @click.prevent="goTag(t)"
              :key="idx"
              class="tag is-warning"
            >{{(t)}}</a>
          </div>
          <div class="article-footer">
            <button @click.prevent="goPost(post.slug)" class="button is-success">Read More...</button>
          </div>
        </div>
      </section>

      <!-- busy notifier -->
      <div v-if="busy" class="notification is-warning">
        <div class="actionbar">
          <p>Searching...</p>
          <i class="fas fa-2x fa-spinner spinner"></i>
        </div>
      </div>

      <!-- error box -->
      <div v-if="error" class="notification errorbox" style="margin-top:auto;">
        <div class="cell-left">
          <div>{{errorMessage}}</div>
          <div>{{errorError}}</div>
        </div>
      </div>
    </div>

    <div class="footer has-text-white">Powered By GlowBlog</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      tag: "",
      title: "",
      subtitle: "",
      postCount: 0,
      busy: true,
      error: false,
      errorMessage: "",
      errorError: ""
    };
  },
  methods: {
    async doSearch() {
      this.busy = true;
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let apiresult = await this.$blogapi.getPostsPaging(
          this.pageNumber,
          9,
          this.tag
        );

        this.busy = false;
        this.postCount = apiresult.data.postCount;
        this.posts = apiresult.data.posts;
      } catch (error) {
        // console.log(err);
        this.error = true;
        this.errorMessage = error.message;
        this.errorError = error.innerMessage;
      } finally {
        this.busy = false;
      }
    },
    async refreshData() {
      try {
        let apiresult = await this.$blogapi.getSiteData();
        this.title = apiresult.data.title;
        this.subtitle = apiresult.data.subtitle;
        document.title = apiresult.data.blogTitle;
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        this.errorError = error.innerMessage;
      }
    },
    goPost(slug) {
      this.$router.push("/post/" + slug);
    },
    goTag(name) {
      if (name === this.tag) return;
      this.tag = name;
      this.$router.push("/tags/" + name);
      this.doSearch();
    }
  },
  mounted() {
    this.tag = this.$route.params.tag;
    this.refreshData();
    this.doSearch();
  }
};
</script>

<style lang="scss" scoped>
.title a {
  color: white;
}

.hero {
  background: linear-gradient(120deg, #5a71a4, #2d3852);
  border-bottom: 1px solid #5a71a4 !important;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}

.footer {
  margin-top: auto;
  width: 100%;
  border-top: 1px solid hsl(221, 29%, 50%);
  display: flex;
  justify-content: center;
  align-content: center;
}

#main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.article-box {
  border-radius: 5px;
  background-color: #2d3852;
  border: 1px solid #5a71a4;
  margin-bottom: 1rem;
  flex-basis: 32%;
  display: flex;
  flex-direction: column;
  &:not(:nth-child(0)) {
    margin-left: 0.5rem;
  }
}

@media (max-width: 768px) {
  .article-box {
    flex-basis: 100%;
    justify-items: center;

    &:not(:nth-child(0)) {
      margin-left: 0;
    }
  }
}

.article-header {
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
}
.article-body {
  padding: 1rem;
}
.article-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  background-color: hsl(221, 29%, 20%);
  border-top: 1px solid #5a71a4;
  padding: 0.5rem 1rem;
  border-radius: 0 0 5px 5px;
  color: white;
}

.tag:not(:nth-child(0)) {
  margin-right: 0.25rem;
}

#posts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  justify-items: flex-start;
}
</style>