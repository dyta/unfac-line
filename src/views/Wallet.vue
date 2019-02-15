<template>
  <div class="unauth" v-if="!isLoading">
    <sui-container text v-if="!isLoading">
      <img src="../assets/logo.png" width="80">
      <br>
      <small>Coming soon.</small>
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

