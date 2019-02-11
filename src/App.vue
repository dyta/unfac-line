<template>
  <div id="app">
    <div v-if="app_id && apiKey && appData && user">
      <router-view/>
    </div>
    <div class="unauth" v-else-if="!app_id || !apiKey || !appData || !user">
      <sui-dimmer :active="isLoading" inverted>
        <sui-loader content="Loading..."/>
      </sui-dimmer>
      <sui-container text v-if="!isLoading">
        <img src="./assets/logo.png" width="80">
        <h2 is="sui-header">Application failed</h2>
        <code>การเข้าถึงแอปพลิเคชันถูกปฏิเสธ</code>
      </sui-container>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  computed: {
    app_id() {
      return this.$store.state.app_Id;
    },
    apiKey() {
      return this.$store.state.apiKey;
    },
    appData() {
      return this.$store.state.appData;
    },
    user() {
      return this.$store.state.user;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  }
};
</script>
