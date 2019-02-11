<template>
  <div class="page">
    <sui-container text>
      <h2 is="sui-header">{{this.$route.query.appid}}</h2>
      <p>{{this.$route.query.key}}</p>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>
