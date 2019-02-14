<template>
  <div id="app">
    <sui-dimmer :active="isLoading" inverted>
      <sui-loader indeterminate content="Loading..."/>
    </sui-dimmer>
    <div v-if="app_id && apiKey && appData && user && user.userAuth != 0">
      <div>
        <router-view/>
      </div>
    </div>
    <div
      class="unauth"
      v-else-if="!app_id || !apiKey || !appData || !user || isLoading || user.userAuth == 0"
    >
      <sui-container text v-if="!isLoading">
        <img src="./assets/logo.png" width="80">

        <div v-if="liff">
          <h2 is="sui-header">Access Denied</h2>
          <p>การเข้าถึงแอปพลิเคชันถูกปฏิเสธ:</p>
          <ul>
            <li>
              <small>ผู้ใช้ {{user.empDisplayName}} อยู่ระหว่างการตรวจสอบข้อมูล</small>
            </li>
            <li>
              <small>การเข้าถึงแอปพลิเคชันระบุที่มาไม่ถูกต้อง</small>
            </li>
          </ul>
          <sui-button
            size="large"
            circular
            basic
            fluid
            @click="()=> $liff.closeWindow()"
          >ปิดหน้าต่าง</sui-button>
        </div>
        <div v-else>
          <h2 is="sui-header">Incorrect access detected.</h2>
          <p class="error">This server may be accessed only through LINE Applicaiton.</p>
          <small>
            Sorry, Please notify
            <a href="https://console.unfac.co">server administrator.</a>
          </small>
        </div>
      </sui-container>
    </div>
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
    liff() {
      return this.$store.state.passingLiff;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  }
};
</script>

<style>
.error {
  margin: 0;
}
small {
  text-align: left !important;
}
</style>



