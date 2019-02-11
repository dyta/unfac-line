<template>
  <div id="app">
    <div v-if="appId && apiKey && appData && user">
      <router-view/>
    </div>
    <div class="unauth" v-else>
      <sui-container text>
        <img src="./assets/logo.png" width="80">
        <h2 is="sui-header">Application failed</h2>
        <code>การเข้าถึงแอปพลิเคชันถูกปฏิเสธ</code>
      </sui-container>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    appId() {
      return this.$store.state.appId;
    },
    apiKey() {
      return this.$store.state.apiKey;
    },
    appData() {
      return this.$store.state.appData;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>
