<template>
  <div>
    <scroller
      :on-refresh="refresh"
      v-if="!isLoading && items.length > 0"
      refreshText="เลื่อนลงเพื่อรีเฟรช"
    >
      <sui-container text class="text-left content">
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
                <sui-button content="รายละเอียด" circular/>
                <sui-button
                  circular
                  :disabled="expired(item.workEndAt) || item.workStatus === 5 || item.approvedSum === item.workVolume"
                  :positive="!expired(item.workEndAt) && item.workStatus !== 5 && item.approvedSum !== item.workVolume"
                  @click.native="toggle(item)"
                  content="ขอรับงาน"
                />
              </sui-button-group>
            </sui-item-content>
          </sui-item>
        </sui-item-group>
      </sui-container>
    </scroller>

    <sui-container class="content" v-else-if="items.length === 0 && !isLoading">
      <sui-message warning class="text-left">
        <sui-message-header>ตอนนี้ยังไม่มีงานเลยนะจ๊ะ</sui-message-header>
        <sui-message-list>
          <sui-message-item>หากมีงานเข้ามาใหม่เราจะแจ้งเตือนให้คุณ {{user.empDisplayName}} ทราบเป็นคนแรก</sui-message-item>
        </sui-message-list>
      </sui-message>
      <sui-button size="big" circular negative fluid @click="()=> $liff.closeWindow()">ปิดหน้าต่าง</sui-button>
    </sui-container>
    <sui-modal v-model="open" :closable="!onClickLoading" animation="fly down" size="mini">
      <sui-modal-header class="no-radius" v-if="record">เลือกจำนวนที่ขอรับทำ</sui-modal-header>
      <sui-modal-content v-if="record">
        <sui-modal-description class="text-center">
          <h3 class="pb-2">หมายเลขงาน #{{record.workId}}</h3>
          <sui-grid :columns="3" divided>
            <sui-grid-row>
              <sui-grid-column>
                <sui-button
                  class="btn-request"
                  basic
                  @click="minusAmount"
                  :disabled="onClickLoading"
                >
                  <sui-icon name="minus"/>
                </sui-button>
              </sui-grid-column>

              <sui-grid-column>
                <h1 class="get-choose">{{request.amount}}</h1>
              </sui-grid-column>
              <sui-grid-column>
                <sui-button class="btn-request" basic @click="addAmount" :disabled="onClickLoading">
                  <sui-icon name="plus"/>
                </sui-button>
              </sui-grid-column>
            </sui-grid-row>
          </sui-grid>
        </sui-modal-description>
      </sui-modal-content>
      <sui-modal-actions v-if="record" class="no-radius">
        <sui-button
          :disabled="!valid || onClickLoading"
          :positive="valid"
          fluid
          size="huge"
          content="ส่งคำขอ"
          class="ml-0"
          @click="onClickRequestWork"
          :loading="onClickLoading"
        />
      </sui-modal-actions>
    </sui-modal>
    <div class="footer">
      <p>&copy; 2019 Unfac.co</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: "home",

  data() {
    return {
      items: [],
      open: false,
      record: null,
      onClickLoading: false,
      request: {
        amount: 0
      },
      TOP_DEFAULT_CONFIG: {
        pullText: "ลากลงเพื่อรีเฟรชข้อมูล", // The text is displayed when you pull down
        triggerText: "释放更新", // The text that appears when the trigger distance is pulled down
        loadingText: "กำลังโหลด...", // The text in the load
        doneText: "รีเฟรชแล้ว", // Load the finished text
        failText: "รีเฟรชล้มเหลว", // Load failed text
        loadedStayTime: 400, // Time to stay after loading ms
        stayDistance: 50, // Trigger the distance after the refresh
        triggerDistance: 50 // Pull down the trigger to trigger the distance
      }
    };
  },
  created() {
    this.$store.commit("setLoading", true);
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
    isLoading() {
      return this.$store.state.isLoading;
    },
    valid() {
      return (
        this.request.amount !== 0 &&
        this.request.amount <= 5 &&
        this.request.amount <= this.record.workVolume - this.record.approved
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

    fetch() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.$api.get(`/app/work/${self.user.entId}`).then(function(res) {
          if (res.data.length > 0) {
            self.items = res.data;
            resolve(res.data);
          } else {
            reject();
          }
          self.$store.commit("setLoading", false);
        });
      });
    },
    refresh(done) {
      this.fetch().then(function() {
        done();
      });
    },
    async onClickRequestWork() {
      let self = this;
      let data = this.record;

      this.onClickLoading = true;
      let request = {
        rwEmpId: self.user.empId,
        rwStartAt: new Date(),
        rwEndAt: self.$moment(data.workEndAt).subtract(1, "days"),
        rwVolume: self.request.amount,
        rwWorkId: data.workId,
        workPickVolume: (data.workPickVolume + self.request.amount) * 1
      };

      const CreateRequest = await self.$api.post(
        `/app/request/${self.app_Id}/${self.apiKey}`,
        request
      );

      if (CreateRequest) {
        self.onClickLoading = false;
        self.open = false;
        self.fetch();
      }
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
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 4px 0;
  background: #e4e4e4;
  font-size: 10px;
}
</style>