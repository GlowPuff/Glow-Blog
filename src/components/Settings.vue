<template>
  <div class="childcontent">
    <!-- error box -->
    <div v-if="error" class="notification actionnotification errorbox">
      <div class="cell-left">
        <div>{{errorMessage}}</div>
        <div>{{errorError}}</div>
      </div>
      <div class="cell-right">
        <button
          @click.prevent="getSettings"
          class="button is-warning is-rounded"
          style="padding-top:.5rem;"
        >
          <i class="fas fa-redo"></i>
        </button>
      </div>
    </div>

    <div v-else>
      <!-- <h1 class="title">Settings</h1> -->
      <div v-if="busy">
        <i class="fas fa-3x fa-spinner spinner"></i>
      </div>
      <div v-else>
        <div v-if="saving" class="savingoverlay"></div>
        <div class="well" style="position:relative;">
          <h1 class="subtitle">Blog Settings</h1>

          <div class="field">
            <label class="label">Blog Title</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="settingsObject.blogTitle"
                placeholder="Appears in the navigation bar. Keep it short."
                style="max-width:350px;"
              />
            </div>
          </div>

          <div class="well smallbox">
            <div class="field">
              <div class="label">Hero Title</div>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="settingsObject.heroTitle"
                  placeholder="Hero block title on the front page"
                />
              </div>
            </div>

            <div class="field">
              <div class="label" style="margin-top:1rem;">Hero Subtitle</div>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  v-model="settingsObject.heroSubtitle"
                  placeholder="Smaller subitle appearing beneath Hero title"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="well" style="position:relative;margin-top:1rem;">
          <h1 class="subtitle">Dashboard Settings</h1>

          <div class="field">
            <label class="label">
              Show this many posts per page in the Dashboard
              <div class="control">
                <input type="text" class="input" v-model="settingsObject.limit" style="width:5rem;" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <p class="gap"></p>

    <div v-if="!busy && !error">
      <a @click.prevent="onSave" :class="['button', 'is-success', {'is-loading':saving}]">Save</a>
      <a
        @click.prevent="$emit('closeSettings')"
        class="button is-danger"
        style="margin-left:1rem;"
      >Close</a>
      <div :class="{'fadeOut':!success}" style="display:inline-block;opacity:1;">
        <p class="has-text-white" style="margin-left:1rem;padding-top:.5rem;">Saved Settings</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  props: [],
  data() {
    return {
      busy: false,
      error: false,
      success: false,
      saving: false,
      settingsObject: {
        blogTitle: "",
        heroTitle: "",
        heroSubtitle: "",
        limit: 0
      },
      errorMessage: "",
      errorError: ""
    };
  },
  methods: {
    async onSave() {
      this.saving = true;
      this.error = false;
      this.success = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let settings = {
          blogTitle: this.settingsObject.blogTitle,
          heroTitle: this.settingsObject.heroTitle,
          heroSubtitle: this.settingsObject.heroSubtitle,
          limit: this.settingsObject.limit
        };

        await this.$blogapi.setSettings(settings);

        this.busy = false;
        this.error = false;
        this.success = true;
        this.saving = false;
        setTimeout(() => (this.success = false), 1000);
      } catch (error) {
        console.log(error);
        this.busy = false;
        this.error = true;
        this.saving = false;
        this.errorMessage = error.data.message;
        this.errorError = error.data.error;
      }
    },
    async getSettings() {
      this.busy = true;
      this.error = false;
      this.success = false;
      this.errorMessage = "";
      this.errorError = "";

      try {
        let apiresult = await this.$blogapi.getSettings();
        this.busy = false;
        this.error = false;
        this.settingsObject = apiresult.data.settings;
      } catch (error) {
        this.busy = false;
        this.error = true;
        this.errorMessage = error.data.message;
        this.errorError = error.data.error;
      }
    }
  },
  mounted() {
    this.getSettings();
  }
};
</script>

<style scoped>
.well {
  padding: 1rem;
}

.gap {
  height: 0.5rem;
}

.label {
  color: white !important;
}

.smallbox {
  background-color: hsl(217, 36%, 34%) !important;
}

.fadeOut {
  transition: 5s linear;
  opacity: 0 !important;
}
</style>