<template>
  <div id="app">
    <sui-dimmer :active="isLoading" inverted>
      <sui-loader indeterminate content="Loading..."/>
    </sui-dimmer>
    <div v-if="app_id && apiKey && appData && user ">
      <sui-segment
        v-if="!isLoading"
        :loading="!appData.entName ? true : false"
        emphasis="secondary"
        class="nav"
      >
        <h3>{{appData.entName}}</h3>
      </sui-segment>
      <div class="pt-4">
        <router-view/>
      </div>
      <sui-segment class="no-radius" v-if="!isLoading">
        <p>&copy; 2019 Unfac.co</p>
      </sui-segment>
    </div>
    <div class="unauth" v-else-if="!app_id || !apiKey || !appData || !user || isLoading">
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



