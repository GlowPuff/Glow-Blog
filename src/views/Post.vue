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

    <div class="container" style="width:100%;">
      <!-- error box -->
      <div v-if="error" class="notification errorbox">
        <div class="cell-left">
          <div>{{errorMessage}}</div>
          <div>{{errorError}}</div>
        </div>
      </div>

      <section id="posts" class="p-1">
        <h1 class="title is-size-4">{{this.post.title}}</h1>
        <h1 class="subtitle">{{this.post.description}}</h1>
        <div class="well">
          <div class="article" v-html="this.post.blogpost"></div>
        </div>
      </section>
    </div>

    <div class="footer has-text-white">Powered By GlowBlog</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      subtitle: "",
      post: {},
      slug: "",
      busy: false,
      error: false,
      errorMessage: "",
      errorError: "",
      description:
        "<h1>hi</h1><p>This is a simple example to demonstrate usage of v-html</p><a href=”#”>Read more</a>"
    };
  },
  methods: {
    async refreshPost() {
      this.post = {};
      this.busy = true;
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let apiresult = await this.$blogapi.getPost(this.slug);
        this.post = apiresult.data.post;
      } catch (error) {
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
    }
  },
  mounted() {
    this.slug = this.$route.params.slug;
    this.refreshData();
    this.refreshPost();
  }
};
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title a {
  color: white;
}

.hero {
  background: linear-gradient(120deg, #5a71a4, #2d3852);
  border-bottom: 1px solid #5a71a4 !important;
  margin-bottom: 1rem;
}

.well {
  padding: 1rem;
}

::v-deep .article * {
  color: white !important;
}
::v-deep .article h1 {
  font-size: 2.2em !important;
}
::v-deep .article h2 {
  font-size: 1.5em !important;
}
::v-deep .article h3 {
  font-size: 1.17em !important;
}
::v-deep .article h4 {
  font-size: 1em !important;
}
::v-deep .article h5 {
  font-size: 0.83em !important;
}
::v-deep .article h6 {
  font-size: 0.67em !important;
}
::v-deep .article p {
  font-size: 1em !important;
  font-weight: 300 !important;
}
::v-deep .article ul,
::v-deep .article ol {
  margin-left: 1rem !important;
}

.footer {
  margin-top: 1rem;
  border-top: 1px solid hsl(221, 29%, 50%);
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>