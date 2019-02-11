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
                @click.native="toggle(item)"
                content="ขอรับงาน"
              />
            </sui-button-group>
          </sui-item-content>
        </sui-item>
      </sui-item-group>
    </sui-container>
    <sui-container class="content" v-else-if="items.length === 0 && !isLoading">
      <sui-message warning class="text-left">
        <sui-message-header>ตอนนี้ยังไม่มีงานเลยนะจ๊ะ</sui-message-header>
        <sui-message-list>
          <sui-message-item>หากมีงานเข้ามาใหม่เราจะแจ้งเตือนให้คุณ {{user.empDisplayName}} ทราบเป็นคนแรก</sui-message-item>
        </sui-message-list>
      </sui-message>
      <sui-button size="big" negative fluid @click="()=> $liff.closeWindow()">ออกจากระบบ</sui-button>
    </sui-container>
    <sui-modal v-model="open" animation="fly down" size="fullscreen">
      <sui-modal-header class="no-radius" v-if="record">เลือกจำนวนที่ขอรับทำ</sui-modal-header>
      <sui-modal-content v-if="record">
        <sui-modal-description class="text-center">
          <h3 class="pb-2">หมายเลขงาน #{{record.workId}}</h3>
          <sui-grid :columns="3" divided>
            <sui-grid-row>
              <sui-grid-column>
                <sui-button class="btn-request" basic @click="minusAmount">
                  <sui-icon name="minus"/>
                </sui-button>
              </sui-grid-column>

              <sui-grid-column>
                <h1 class="get-choose">{{request.amount}}</h1>
              </sui-grid-column>
              <sui-grid-column>
                <sui-button class="btn-request" basic @click="addAmount" :disabled="limitPlus">
                  <sui-icon name="plus"/>
                </sui-button>
              </sui-grid-column>
            </sui-grid-row>
          </sui-grid>
        </sui-modal-description>
      </sui-modal-content>
      <sui-modal-actions v-if="record" class="no-radius">
        <sui-button
          :disabled="!valid"
          :positive="valid"
          fluid
          size="huge"
          content="ส่งคำขอ"
          class="ml-0"
        />
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      items: [],
      open: false,
      record: null,
      request: {
        amount: 0
      }
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
    },
    valid() {
      return (
        this.request.amount !== 0 &&
        this.request.amount <= 5 &&
        this.request.amount <= this.record.workVolume - this.record.approved
      );
    },
    limitPlus() {
      return (
        this.request.amount >= this.record.workVolume - this.record.approved
      );
    }
  },
  methods: {
    addAmount() {
      if (this.record) {
        return this.request.amount <
          this.record.workVolume - this.record.approved &&
          this.request.amount < 5 // limit แต่ละ user
          ? this.request.amount++
          : false;
      }
    },
    minusAmount() {
      return this.request.amount !== 0 ? this.request.amount-- : false;
    },
    async toggle(record) {
      if (record) {
        this.request.amount = 0;
        this.record = await record;
      }

      this.open = !this.open;
    },
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
.ui.modal > .content {
  margin-top: 0;
}
.btn-request {
  height: 100%;
  width: 100%;
  text-align: center;
}
.ui.button:not(.icon) > .icon:not(.button):not(.dropdown) {
  margin: 0 !important;
}
</style>