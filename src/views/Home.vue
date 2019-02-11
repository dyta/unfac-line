<template>
  <div class="page" v-if="verify">
    <sui-container text class="text-left">
      <h2 is="sui-header">{{app_Id}}</h2>
      <p>{{apiKey}}</p>
      <pre>{{appData}}</pre>
      <pre>{{user}}</pre>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "home",
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
    verify() {
      return Boolean(this.$store.state.user.userAuth);
    }
  }
};
</script>
