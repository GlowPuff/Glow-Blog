<template>
  <div class="childcontent">
    <input @change="onFileInput" ref="fileInput" type="file" style="position: fixed; top: -100em" />
    <div>
      <div class="well" style="position:relative;">
        <div class="feedback">
          <div style="flex:3 0;">
            <h1 class="subtitle" style="margin:0 !important;">Image Gallery</h1>
            <h1
              class="subtitle is-size-6"
              style="margin-top:.25rem !important;"
            >Image Count: {{imageCount}}</h1>
          </div>
          <progress
            v-if="uploading"
            class="progress is-link"
            style="margin-left:auto;flex:1 0"
            max="100"
            :value="uploadPercentage"
          />
        </div>

        <!-- error box -->
        <div v-if="error" class="notification errorbox">
          <div class="cell-left">
            <div>{{errorMessage}}</div>
            <div>{{errorError}}</div>
          </div>
        </div>

        <div class="busybox" v-if="busy">
          <i class="fas fa-3x fa-spinner spinner"></i>
        </div>

        <div v-else class="gallery-container">
          <div v-if="uploading" class="savingoverlay"></div>
          <div
            :class="['droptarget',{'dropHovering':isDropHovering}]"
            @click="onDropClick"
            @dragover.prevent.stop="onDragging"
            @dragenter.prevent.stop="dragEnter"
            @dragleave.prevent.stop="dragLeave"
            @drop.prevent.stop="onDrop($event)"
          >
            <h1 class="droptext">Click or Drag 'n Drop Image Here</h1>
          </div>
          <Thumb
            v-for="(item,index) in imageList"
            :key="index"
            :source="item.source"
            class="gallery-item"
            v-on:deleteImage="onDelete"
          />
        </div>

        <!-- pagination -->
        <nav class="pagination">
          <a
            :disabled="busy || pageNumber===1"
            @click.prevent="onPrevious"
            class="pagination-previous"
          >Previous</a>
          <a
            :disabled="busy || limit*pageNumber >= imageCount"
            @click.prevent="onNext"
            class="pagination-next"
          >Next page</a>
        </nav>
      </div>

      <a
        @click.prevent="$emit('closeGallery')"
        class="button is-danger"
        style="margin-top:.5rem;"
      >Close</a>
      <a
        @click.prevent="refresh"
        :class="['button', 'is-warning',{'is-loading':busy}]"
        style="margin-top:.5rem;margin-left:.5rem;"
      >
        <i class="fas fa-redo"></i>
      </a>
    </div>
  </div>
</template>

<script>
import Thumb from "@/components/Thumb.vue";

export default {
  components: {
    Thumb
  },
  data() {
    return {
      busy: false,
      error: false,
      uploading: false,
      imageCount: 0,
      limit: 16,
      pageNumber: 1,
      isDropHovering: false,
      file: "",
      uploadPercentage: 0,
      errorMessage: "",
      errorError: "",
      imageList: [
        // {
        //   image: "http://localhost/gallery/thumbs/beta.jpg"
        // },
        // {
        //   image: "http://localhost/gallery/thumbs/charlie.jpg"
        // },
        // {
        //   image: "http://localhost/gallery/thumbs/delta.jpg"
        // }
      ]
    };
  },
  methods: {
    dragEnter() {
      this.isDropHovering = true;
    },
    dragLeave() {
      this.isDropHovering = false;
    },
    onDragging() {
      this.isDropHovering = true;
    },
    onDrop(item) {
      this.isDropHovering = false;
      if (item.dataTransfer.files[0]) this.sendFile(item.dataTransfer.files[0]);
    },
    onDelete() {
      this.refresh();
    },
    async refresh(clearError = false) {
      this.busy = true;
      this.imageList = [];
      if (clearError) this.error = false;

      try {
        let apiresult = await this.$blogapi.getImages(
          this.pageNumber,
          this.limit
        );
        this.busy = false;
        this.imageCount = apiresult.data.imagecount;
        this.imageList = apiresult.data.sources;
      } catch (error) {
        this.busy = false;
        this.error = true;
        this.errorMessage = error.data.message;
        this.errorError = error.data.error;
      }
    },
    onNext() {
      if (this.busy || 10 * this.pageNumber >= this.postCount) return;
      else this.pageNumber++;
      this.refresh();
    },
    onPrevious() {
      if (this.busy || this.pageNumber === 1) return;
      else this.pageNumber--;
      this.refresh();
    },
    onDropClick() {
      this.$refs.fileInput.click();
    },
    onFileInput() {
      if (this.$refs.fileInput.files.length > 0)
        this.sendFile(this.$refs.fileInput.files[0]);
    },
    async sendFile(file) {
      this.uploadPercentage = 0;
      this.uploading = true;
      this.error = false;
      this.errorMessage = "";
      this.errorError = "";

      let formData = new FormData();
      formData.append(
        "file",
        file,
        file.name.replace(/[^a-z0-9._-]/gi, "_").trim()
      );

      try {
        await this.$blogapi.uploadImage(formData, this.uploadCallback);
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
        this.refresh();
      }
    },
    uploadCallback(progressEvent) {
      // console.log(progressEvent);
      this.uploadPercentage = parseInt(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      );
    }
  },
  created() {
    this.refresh();
  }
};
</script>

<style lang="scss" scoped>
.well {
  padding: 1rem;
}

.gallery-container {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-around;
}

.droptarget {
  width: 125px;
  height: 100px;
  padding: 0.25rem;
  border: 2px dashed #5a71a4;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  text-align: center;
  &:hover {
    background-color: hsl(221, 29%, 35%);
    cursor: pointer;
  }
  &.dropHovering {
    background-color: hsl(221, 29%, 35%);
  }
}

.droptext {
  margin: auto;
  color: white;
}

.busybox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.feedback {
  display: flex;
  margin-bottom: 1rem;
}
</style>