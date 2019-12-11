<template>
  <div>
    <div :class="['menucontainer', {'active':sideactive}]">
      <div class="menuwrapper">
        <aside class="menu p-1" style="margin-top:4rem;">
          <!-- <ul class="menu-list">
                <a href class="menu-label">
                  <i class="fas fa-home"></i> Dashboard Home
                </a>
          </ul>-->
          <p v-if="menuActions.length>0" class="menu-label">{{menuLabel}}</p>
					<!-- dynaimic menu items -->
          <ul class="menu-list">
            <li v-for="item in menuActions" :key="item.label">
              <a @click.prevent="$emit(item.actionName)">
                <i :class=item.icon></i>
                {{item.label}}
              </a>
            </li>
          </ul>
          <p class="menu-label">Configure</p>
          <ul class="menu-list">
            <li>
              <a @click="onShowSettings">
                <i class="fas fa-cog"></i> Blog Settings
              </a>
            </li>
            <li>
              <a @click.prevent="$emit('onLogout')">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sideactive", "menuLabel", "menuActions"],
  methods: {
    setMenuHeight() {
      let navheight = document.querySelector("#navbar").offsetHeight;
      document.querySelector(".menuwrapper").style.height =
				document.documentElement.clientHeight - navheight + "px";
				//console.log(document.documentElement.clientHeight - navheight);
    },
    onShowSettings() {
      this.$emit("toggleSettings");
    }
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setMenuHeight();
    });
    window.addEventListener("resize", () => {
      this.setMenuHeight();
    });
  }
};
</script>

<style lang="scss" scoped>
</style>