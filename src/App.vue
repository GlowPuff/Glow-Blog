<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<style>
/* Bulma fix to get rid of vertical scrollbar */
html {
  overflow-y: auto !important;
}

@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
@import url("https://fonts.googleapis.com/css?family=Montserrat|Roboto&display=swap");

#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: Montserrat;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
