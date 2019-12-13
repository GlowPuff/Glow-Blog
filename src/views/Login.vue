<template>
  <section>
    <div class="columns is-centered is-vertical-center">
      <transition name="login" v-on:after-leave="this.navToDashboard">
        <form v-if="visible" class="column is-5-tablet">
          <div class="box is-border">
            <h1 class="label has-text-white is-size-4 has-text-centered">GlowBlog Login</h1>

            <div class="field">
              <label class="label has-text-white is-size-6">Email Address:</label>
              <div class="control has-icons-left">
                <input
                  class="input"
                  type="text"
                  autocomplete="email"
                  :disabled="busy"
                  v-model="inputEmail"
                  placeholder="Your Email"
                />
                <span class="icon is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>
            <h2
              v-if="this.emailError"
              class="notification is-danger subtitle is-6"
            >Enter an email address.</h2>

            <div class="field">
              <label class="label has-text-white is-size-6">Password:</label>
              <div class="control has-icons-left">
                <input
                  class="input"
                  type="password"
                  autocomplete="password"
                  :disabled="busy"
                  v-model="inputPass"
                  placeholder="Your Password"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </div>
              <h2 v-if="passError" class="notification is-danger subtitle is-6">Enter a password.</h2>
            </div>

            <div class="field">
              <p class="control">
                <button
                  v-show="!this.setupSuccess"
                  @click.prevent="login"
                  :disabled="!this.visible"
                  class="button has-text-weight-bold is-fullwidth has-text-white is-primary"
                  :class="{'is-loading':this.busy}"
                >Login</button>
              </p>
            </div>

            <div v-if="this.setupError" class="notification is-danger">
              <p>{{errorCode}}</p>
              <p>{{errorMessage}}</p>
            </div>

            <div v-if="this.setupSuccess" class="level notification is-success">
              <p class="level-left">Account Created, logging in...</p>
              <p class="level-right">
                <i class="fas fa-spinner spinner"></i>
              </p>
            </div>
          </div>
        </form>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      busy: false,
      inputEmail: "",
      inputPass: "",
      emailError: false,
      passError: false,
      setupError: false,
      setupSuccess: false,
      errorMessage: "",
      errorCode: ""
    };
  },
  methods: {
    async login() {
      this.busy = true;
      this.setupError = false;

      try {
        await this.$blogapi.login(
          this.inputEmail,
          this.inputPass
        );
        this.setupSuccess = true;
        this.visible = false;
      } catch (error) {
        this.errorCode = error.message;
        this.errorMessage = error.innerMessage;
        this.setupSuccess = false;
        this.setupError = true;
      } finally {
        this.busy = false;
      }
    },
    navToDashboard() {
      this.$router.replace("dashboard");
    }
  },
  mounted() {
    this.visible = true;
  }
};
</script>

<style scoped lang="scss">
.login-enter-active,
.login-leave-active {
  transition: 0.75s;
  transition-timing-function: ease-out;
}

.login-enter-to,
.login-leave {
  opacity: 1;
}

.login-enter {
  opacity: 0;
  transform: translateY(-10%);
}

.login-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
</style>