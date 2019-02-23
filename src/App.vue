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
      <div v-if="!isLoading && user && user.empStatus === 1" class="pt-2 pb-5">
        <sui-container text>
          <sui-image :src="user.empPictureUrl" width="80" size="tiny" circular centered/>

          <h2 is="sui-header">กรอกข้อมูลพนักงาน</h2>
          <sui-divider/>
          <label style="padding-top: 0">เลขบัตรประจำตัวประชาชน</label>
          <sui-input
            :error="!hasIdentity"
            placeholder="เลข 13 หลักไม่มีขีด"
            v-model="employee.empIdentity"
          />
          <label>ชื่อ-นามสกุล</label>
          <sui-input :error="!hasName" placeholder="ณรงค์ ดีใจ" v-model="employee.empFullname"/>
          <label>เบอร์โทร</label>
          <sui-input :error="!hasTel" placeholder="0987654321" v-model="employee.empPhoneNumber"/>
          <label>ที่อยู่</label>
          <sui-input
            :error="!hasAddress"
            placeholder="เลขที่ อาคาร หมู่ ถนน"
            v-model="employee.empAddress"
          />
          <sui-input class="pt-1" disabled v-model="employee.empAddress2"/>
          <label>พื้นที่</label>
          <sui-button @click.native="toggle" fluid size="large">เลือกพื้นที่</sui-button>
          <br>
          <sui-button
            :positive="hasIdentity && hasName && hasTel && hasAddress && hasCountry"
            :disabled="!hasIdentity || !hasName || !hasTel || !hasAddress || !hasCountry"
            fluid
            size="big"
            content="ยืนยัน"
            class="pt-3"
          />
          <sui-modal v-model="open">
            <sui-modal-content>
              <sui-modal-description>
                <ThailandAutoComplete
                  v-model="district"
                  type="district"
                  @select="select"
                  label="ตำบล"
                  color="#42b883"
                  size="medium"
                  placeholder="ตำบล"
                />
                <ThailandAutoComplete
                  v-model="zipcode"
                  type="zipcode"
                  @select="select"
                  label="รหัสไปรษณีย์"
                  size="medium"
                  color="#00a4e4"
                  placeholder="รหัสไปรษณีย์"
                  class="mb-4"
                />
              </sui-modal-description>
            </sui-modal-content>
          </sui-modal>
        </sui-container>
      </div>
      <div class="unauth" v-else-if="!isLoading && user && user.empStatus === 2">
        <sui-container text>
          <img src="./assets/logo.png" width="80">
          <h2 is="sui-header">อยู่ระหว่างการตรวจสอบข้อมูล</h2>
          <small>เพื่อยืนยันการเป็นพนักงานกับ {{appData.entName}}</small>
          <br>
          <small>ใช้เวลาไม่นาน หากข้อมูลมีความถูกต้อง</small>
          <br>
          <small>
            คุณ
            <b>{{user.empFullname}}</b> จะได้รับการแจ้งเตือนหากมีการเปลี่ยนแปลง
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
          <h2 is="sui-header">บัญชีของคุณ
            <br>ไม่ได้รับอนุญาติให้ใช้งาน
          </h2>
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
    <div class="footer">
      <p>&copy; 2019 Unfac.co</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      employee: {
        empIdentity: "",
        empFullname: "",
        empPhoneNumber: "",
        empAddress: "",
        empAddress2: ""
      },
      district: "",
      zipcode: ""
    };
  },
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
    },
    hasIdentity() {
      return this.employee.empIdentity.length === 13;
    },
    hasName() {
      return this.employee.empFullname.length > 0;
    },
    hasTel() {
      return this.employee.empPhoneNumber.length === 10;
    },
    hasAddress() {
      return this.employee.empAddress.length > 0;
    },
    hasCountry() {
      return this.zipcode.length === 5;
    }
  },
  methods: {
    toggle() {
      this.open = !this.open;
      this.employee.empAddress2 = "";
      this.zipcode = "";
      this.district = "";
    },
    select(address) {
      this.employee.empAddress2 =
        " " +
        address.district +
        " " +
        address.amphoe +
        " " +
        address.province +
        " " +
        address.zipcode;
      this.zipcode = address.zipcode;
      this.open = !this.open;
    },
    onCLickUpdateProfile() {}
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



