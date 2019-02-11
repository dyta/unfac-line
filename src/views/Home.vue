<template>
  <div class="page" v-if="verify">
    <sui-container text class="text-left content" v-if="!isLoading && items.length > 0">
      <sui-item-group divided>
        <sui-item v-for="(item, index) in items" :key="index">
          <sui-item-image size="small" wrapped :src="item.workImages"/>
          <sui-item-content>
            <sui-item-header>
              <sui-input transparent :value="item.workName" disabled icon-position="left"/>
            </sui-item-header>
            <sui-item-meta>
              <small class="price">
                <sui-label :color="status(item.workStatus).color" circular empty horizontal/>
                <b>{{status(item.workStatus).text}}</b>
                -
                ค่าจ้าง: {{item.workEarn}} บาท ({{item.workEarnType === 1 ? 'ต่อชิ้น': 'เหมา' }})
              </small>
              <br>
              <small class="stay">
                <b>เวลาปิดรับงาน: {{$moment(item.workEndAt).subtract(2 ,'days').fromNow()}}</b>
              </small>
            </sui-item-meta>
            <sui-item-description>
              <sui-progress
                :percent="percent(item.approvedSum, item.workVolume)"
                state="active"
                indicating
                size="tiny"
                :label="`อนุมัติแล้ว ${item.approvedSum ? item.approvedSum : 0}/${item.workVolume}`"
              />
            </sui-item-description>
            <sui-button-group attached="bottom" class="pt-1">
              <div is="sui-button" content="รายละเอียด"/>
              <div
                is="sui-button"
                :disabled="expired(item.workEndAt) || item.workStatus === 5"
                :positive="!expired(item.workEndAt) && item.workStatus !== 5"
                content="ขอรับงาน"
              />
            </sui-button-group>
          </sui-item-content>
        </sui-item>
      </sui-item-group>
    </sui-container>
    <sui-container class="content" v-else-if="items.length === 0 && isLoading">
      <sui-message warning class="text-left">
        <sui-message-header>ตอนนี้ยังไม่มีงานเลยนะจ๊ะ</sui-message-header>
        <sui-message-list>
          <sui-message-item>หากมีงานเข้ามาใหม่เราจะแจ้งเตือนให้คุณ {{user.empDisplayName}} ทราบเป็นคนแรก</sui-message-item>
        </sui-message-list>
      </sui-message>
      <sui-button size="big" positive fluid @click="()=> $liff.closeWindow()">ออกจากระบบ</sui-button>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      items: []
    };
  },
  created() {
    this.fetch();
  },
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
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  methods: {
    status(c) {
      let set = {
        text: "",
        color: ""
      };
      switch (c) {
        case 3:
          set = {
            text: "ปกติ",
            color: "blue"
          };
          break;
        case 4:
          set = {
            text: "เร่งด่วน",
            color: "red"
          };
          break;
        case 5:
          set = {
            text: "ปิดรับชั่วคราว",
            color: "orange"
          };
          break;

        default:
          break;
      }
      return set;
    },
    percent(x, y) {
      return Math.floor((x / y) * 100);
    },
    expired(time) {
      return this.$moment() > this.$moment(time).subtract(2, "days");
    },
    async fetch() {
      let self = this;
      this.$store.commit("setLoading", true);
      await this.$api.get(`/app/work/${this.user.entId}`).then(function(res) {
        if (res.data.length > 0) {
          self.items = res.data;
        }
        setTimeout(() => {
          self.$store.commit("setLoading", false);
        }, 2000);
      });
    }
  }
};
</script>

<style scope>
.ui.transparent.input > input {
  font-weight: bold;
  width: 60vw;
}
.ui.disabled.input,
.ui.input:not(.disabled) input[disabled] {
  opacity: 1 !important;
}
</style>