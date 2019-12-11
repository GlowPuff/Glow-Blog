<template>
  <div class="childcontent">
    <h1 class="title">New Post</h1>
    <div class="well p-1" style="position:relative;margin-bottom:1rem;">
      <div class="field">
        <label class="label">Title</label>
        <input
          type="text"
          class="input"
          placeholder="Title for your post"
          v-model.trim="post.title"
          @change="onTitleChange"
          @input="onTitleUpdate"
        />
      </div>
      <div class="field">
        <label class="label">Slug</label>
        <input
          type="text"
          class="input"
          placeholder="Automatically filled in, but can be edited"
          v-model="post.slug"
          @input="onSlugChange"
        />
      </div>
      <div class="field">
        <label class="label">Description</label>
        <input
          type="text"
          class="input"
          placeholder="A short description of your post"
          v-model="post.description"
          @input="updateDisable"
        />
      </div>
      <div class="field">
        <label class="label">Tags</label>
        <input
          type="text"
          class="input"
          placeholder="Separate each tag with a comma"
          v-model.trim="post.tags"
          @change="onTagsChange"
        />
      </div>
    </div>
    <vue-editor
      v-model="post.blogpost"
      :editorToolbar="customToolbar"
      :disabled="saving"
      useCustomImageHandler
      @image-added="handleImageAdded"
    ></vue-editor>

    <div class="btnrow" v-if="!finished" style="margin-top:1rem;">
      <a
        @click.prevent="doPost(false)"
        :class="['button', 'is-success', {'is-loading':saving}]"
        :disabled="saving || disableSave"
      >{{actionTitle}}</a>
      <a
        v-if="!saving"
        @click.prevent="$emit('closePost')"
        class="button is-danger"
        style="margin-left:1rem;"
        :disabled="saving"
      >Cancel</a>
      <a
        v-if="mode==='create'"
        @click.prevent="doPost(true)"
        :class="['button', 'is-warning', {'is-loading':saving}]"
        :disabled="saving || disableSave"
        style="margin-left:auto;"
      >Save Draft</a>
    </div>

    <!-- error box -->
    <div v-if="error" class="notification actionnotification errorbox">
      <div class="cell-left">
        <div>{{errorMessage}}</div>
        <div>{{errorError}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },
  props: ["dynamicProperties"],
  data() {
    return {
      post: {},
      tags: [],
      editor: null,
      disableSave: true,
      uploading: false,
      mode: "create",
      error: false,
      saving: false,
      finished: false,
      errorMessage: "",
      errorError: "",
      customToolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"],
        [{ color: ["red"] }, { background: [] }]
      ]
    };
  },
  computed: {
    actionTitle() {
      return this.mode === "create" ? "Create Post" : "Edit Post";
    }
  },
  created() {
    this.post = this.dynamicProperties.post;
    this.mode = this.dynamicProperties.mode;
    this.tags = this.dynamicProperties.post.tags;
    if (this.mode === "edit") this.disableSave = false;
  },
  methods: {
    onSaveDraft() {
      this.doPost();
    },
    onPost() {
      this.doPost();
    },
    async doPost(isDraft) {
      this.saving = true;
      this.error = false;
      this.finished = false;
      this.errorMessage = "";
      this.errorError = "";

      this.post.featureImage = "feature image";
      this.post.isDraft = isDraft;
      this.post.tags = this.tags;

      try {
        await this.$blogapi.sendPost(this.post, this.mode);

        this.error = false;
        this.finished = true;
        this.$emit("closePost");
        this.$emit("notify", {
          message: "successfully posted",
          isError: false
        });
      } catch (error) {
        // console.log(error);
        this.busy = false;
        this.error = true;
        this.errorMessage = error.message;
        this.errorError = error.innerMessage;
      } finally {
        this.saving = false;
      }
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";
      this.uploading = true;

      let formData = new FormData();
      formData.append(
        "file",
        file,
        file.name.replace(/[^a-z0-9._-]/gi, "_").trim()
      );

      try {
        let apiresult = await this.$blogapi.uploadImage(
          formData,
          this.uploadCallback
        );
        let url = apiresult.data.baseURL;
        console.log(url);
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();

        this.$emit("notify", {
          message: "image uploaded",
          isError: false
        });
      } catch (error) {
        this.error = true;
        this.errorMessage = error.data.message;
        this.errorError = error.data.error;
      } finally {
        this.uploading = false;
      }
    },
    onTitleUpdate() {
      //Create a slug from the Title, adding a dash between words
      this.post.slug = this.post.title
        .split(" ")
        .join("-")
        .toLowerCase();

      this.updateDisable();
    },
    onTitleChange() {
      //Replace multiple spaces with a single space between words
      this.post.title = this.post.title.replace(/ +(?= )/g, "");
      //Make each word capitalized
      this.post.title = this.post.title
        .toLowerCase()
        .split(" ")
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    },
    onSlugChange() {
      //Replace multiple spaces with a single space between words
      this.post.slug = this.post.slug.replace(/ +(?= )/g, "");
      this.post.slug = this.post.slug
        .split(" ")
        .join("-")
        .toLowerCase();

      this.updateDisable();
    },
    onTagsChange() {
      this.tags =
        this.post.tags.indexOf(",") > 0
          ? this.post.tags.split(",").map(val => val.trim())
          : [this.post.tags];
    },
    updateDisable() {
      this.disableSave =
        !this.post.title || !this.post.slug || !this.post.description;
    }
  }
};
</script>

<style scoped>
.ql-toolbar {
  background-color: blue !important;
}

.ql-editor {
  background-color: white !important;
}

.quillWrapper {
  background-color: white;
  color: black;
}

.btnrow {
  display: flex;
}
</style>