<template>
  <div id="app">
    <sui-dimmer :active="isLoading" inverted>
      <sui-loader indeterminate content="กำลังโหลด..."/>
    </sui-dimmer>
    <div
      v-if="app_id && apiKey && appData && user && user.empStatus === 3 && user.userAuth != 0 && liff"
    >
      <div>
        <router-view/>
      </div>
    </div>
    <div v-else>
      <div v-if="!isLoading && user && user.empStatus === 1" class="pt-5">
        <sui-container text>
          <img src="./assets/logo.png" width="80">
          <h2 is="sui-header">กรอกข้อมูลพนักงาน</h2>
          <label>เลขบัตรประชาชน</label>
          <sui-input placeholder="0-0000-00000-00-0"/>
          <label>ชื่อ</label>
          <sui-input/>
          <label>นามสกุล</label>
          <sui-input/>
          <label>เบอร์โทร</label>
          <sui-input placeholder="0987654321"/>
          <label>ที่อยู่</label>
          <sui-input placeholder="เลขที่ อาคาร หมู่ ถนน"/>
        </sui-container>
      </div>
      <div class="unauth" v-else-if="!isLoading && user && user.empStatus === 2">
        <sui-container text>
          <img src="./assets/logo.png" width="80">
          <h2 is="sui-header">อยู่ระหว่างการตรวจสอบข้อมูล</h2>
          <small>
            คุณ
            <b>{{user.empDisplayName}}</b>
            อยู่ระหว่างการตรวจสอบข้อมูลเพื่อยืนยันการเป็นพนักงาน
          </small>
          <sui-button
            size="large"
            circular
            basic
            fluid
            style="margin-top: 2rem"
            @click="()=> $liff.closeWindow()"
          >ปิดหน้าต่าง</sui-button>
        </sui-container>
      </div>
      <div
        class="unauth"
        v-else-if="!isLoading && user && user.empStatus === 3 && user.userAuth === 0"
      >
        <sui-container text>
          <img src="./assets/logo.png" width="80">
          <h2 is="sui-header">บัญชีของคุณไม่ได้รับอนุญาติให้ใช้งาน</h2>
          <small>
            กรุณาติดต่อ {{appData.entName}} -
            <u>{{appData.entTel}}</u>
          </small>
          <sui-button
            size="large"
            circular
            basic
            fluid
            style="margin-top: 2rem"
            @click="()=> $liff.closeWindow()"
          >ปิดหน้าต่าง</sui-button>
        </sui-container>
      </div>
      <div class="unauth" v-else>
        <sui-container text>
          <div v-if="!isLoading">
            <img src="./assets/logo.png" width="80">
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



