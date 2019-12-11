<template>
  <div id="main">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{title}}</h1>
          <h2 class="subtitle has-text-white">{{subtitle}}</h2>
        </div>
      </div>
    </section>

    <div class="main-container">
      <div>
        <!-- error box -->
        <div v-if="error" class="notification errorbox">
          <div class="cell-left">
            <div>{{errorMessage}}</div>
            <div>{{errorError}}</div>
          </div>
        </div>

        <section id="posts" class="p-1">
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

        <!-- pagination -->
        <nav class="pagination p-1">
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
      </div>

      <div class="archive">
        <h5 class="subtitle has-text-white">Archive</h5>
        <i v-if="archivebusy" class="fas fa-2x fa-spinner spinner"></i>
        <ul>
          <li v-for="(item,index) in archive" :key="index">
            <a @click.prevent="goArchive(item)">{{ item }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer has-text-white">Powered By GlowBlog</div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      limit: 12,
      title: "",
      subtitle: "",
      pageNumber: 1,
      postCount: 0,
      posts: [],
      archive: [],
      error: false,
      busy: false,
      archivebusy: true,
      errorMessage: "",
      errorError: ""
    };
  },
  methods: {
    async refreshPosts() {
      this.posts = [];
      this.busy = true;
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let apiresult = await this.$blogapi.getPostsPaging(
          this.pageNumber,
          this.limit
        );
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
    async refreshArchive() {
      this.archivebusy = true;

      try {
        let apiresult = await this.$blogapi.getArchive();
        this.archive = Object.keys(apiresult.data.archive);
      } catch (error) {
        // console.log(err);
      } finally {
        this.archivebusy = false;
      }
    },
    async refreshData() {
      try {
        let apiresult = await this.$blogapi.getSiteData();
        this.title = apiresult.data.title;
        this.subtitle = apiresult.data.subtitle;
        document.title = apiresult.data.blogTitle;
        // console.log(apiresult);
      } catch (error) {
        // console.log(err);
        this.error = true;
        this.errorMessage = error.message;
        this.errorError = error.innerMessage;
      }
    },
    onPrevious() {
      if (this.busy || this.pageNumber === 1) return;
      else this.pageNumber--;
      this.refreshPosts();
    },
    onNext() {
      if (this.busy || this.limit * this.pageNumber >= this.postCount) return;
      else this.pageNumber++;
      this.refreshPosts();
    },
    goTag(name) {
      this.$router.push("tags/" + name);
    },
    goPost(slug) {
      this.$router.push("post/" + slug);
    },
    goArchive(name) {
      let date = name.split(" ");
      this.$router.push("archive/" + date[1] + "/" + date[0]);
    }
  },
  mounted() {
    this.refreshPosts();
    this.refreshData();
    this.refreshArchive();
  }
};
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-container {
  width: 85%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 10fr 3fr;
}

.archive {
  background-color: #2d3852;
  border: 1px solid #5a71a4;
  border-radius: 5px;
  padding: 0.5rem;
  color: white !important;
  margin-top: 0.75rem;
  margin-right: 0.75rem;
  align-self: start;
}

.hero {
  background: linear-gradient(120deg, #5a71a4, #2d3852);
  border-bottom: 1px solid #5a71a4 !important;
  margin-bottom: 1rem;
}

.article-box {
  border-radius: 5px;
  background-color: #2d3852;
  border: 1px solid #5a71a4;
  flex-basis: 32%;
  display: flex;
  flex-direction: column;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
}

.footer {
  margin-top: auto;
  border-top: 1px solid hsl(221, 29%, 50%);
  display: flex;
  justify-content: center;
  align-content: center;
}

@media (max-width: 768px) {
  #posts {
    grid-template-columns: 100%;
  }

  .article-box {
    flex-basis: 100%;
  }

  .main-container {
    width: 100%;
    grid-template-columns: 100%;
    grid-template-rows: auto auto;
  }

  .archive {
    margin: 0 0.75rem;
  }

  .footer {
    margin-top: 1rem;
  }
}
</style>