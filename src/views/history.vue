<template>
  <div class="unauth" v-if="!isLoading">
    <sui-container text v-if="!isLoading">
      <img src="../assets/logo.png" width="80">
      <br>Go to
      <a href="https://console.unfac.co">Unfac.co</a>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "account",
  computed: {
    app_Id() {
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

