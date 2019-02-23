<template>
  <div v-if="!isLoading" class="pt-2">
    <sui-container text v-if="!isLoading">
      <sui-container text>
        <sui-image :src="user.empPictureUrl" width="80" size="tiny" circular centered/>

        <h2 is="sui-header">ข้อมูลส่วนตัว</h2>
        <sui-divider/>
        <label style="padding-top: 0">เลขบัตรประจำตัวประชาชน</label>
        <sui-input :value="employee.empIdentity" disabled inverted/>
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
          @click="onCLickUpdateProfile"
          content="แก้ไขข้อมูล"
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
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      open: false,
      employee: {
        empIdentity: this.$store.state.user.empIdentity,
        empFullname: this.$store.state.user.empFullname,
        empPhoneNumber: this.$store.state.user.empPhoneNumber,
        empAddress: this.$store.state.user.empAddress,
        empAddress2: this.$store.state.user.empAddress2,
        empStatus: 3
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
    onCLickUpdateProfile() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.$api
          .put(`/app/employee/${self.user.empId}`, self.employee)
          .then(function(res) {
            if (res.data) {
              resolve(self.$router.go("/"));
            } else {
              reject(alert(res.data));
            }
            self.$store.commit("setLoading", false);
          });
      });
    }
  }
};
</script>

