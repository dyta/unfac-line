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
                <sui-input
                  transparent
                  :value="`#`+item.mfId +` - `+ item.workName"
                  disabled
                  icon-position="left"
                />
              </sui-item-header>
              <sui-item-meta>
                <small class="price">
                  <sui-label :color="status(item.mfStatus).color" circular empty horizontal/>
                  <b>{{status(item.mfStatus).text}}</b>
                  -
                  ค่าจ้าง: {{item.workEarn}} บาท ({{item.workEarnType === 1 ? 'ต่อชิ้น': 'เหมา' }})
                </small>
                <br>
                <small>
                  <b>วันที่ทำรายการ:</b>
                  {{$moment(item.mfCreateAt).format('DD MMM YYYY HH:mm:ss')}}
                </small>
              </sui-item-meta>
              <sui-item-description>
                <sui-progress
                  :percent="percent(item.mfProgress, item.maxVolume)"
                  state="active"
                  indicating
                  size="tiny"
                  :label="`ความคืบหน้า ${item.mfProgress ? item.mfProgress : 0}/${item.maxVolume}`"
                />
              </sui-item-description>
              <sui-button-group attached="bottom" class="pt-1">
                <sui-button
                  circular
                  :disabled="item.mfProgress === item.maxVolume"
                  :positive="item.mfProgress !== item.maxVolume"
                  @click.native="toggle(item)"
                  content="ส่งอัพเดทความคืบหน้า"
                  :loading="onClickLoading"
                />
              </sui-button-group>
            </sui-item-content>
          </sui-item>
        </sui-item-group>
      </sui-container>
    </scroller>
    <scroller
      :on-refresh="refresh"
      v-else-if="items.length === 0 && !isLoading"
      refreshText="เลื่อนลงเพื่อรีเฟรช"
    >
      <sui-container class="content">
        <sui-message warning class="text-center">
          <sui-message-header>ไม่พบงานที่คุณเคยทำ</sui-message-header>
        </sui-message>
        <sui-button size="large" circular basic fluid @click="()=> $liff.closeWindow()">ปิดหน้าต่าง</sui-button>
      </sui-container>
    </scroller>
    <sui-modal v-model="open" :closable="!onClickLoading" animation="fly down" size="mini">
      <sui-modal-header class="no-radius" v-if="record">ส่งความคืบหน้า</sui-modal-header>
      <sui-modal-content v-if="record">
        <sui-modal-description class="text-center">
          <h3>หมายเลขการผลิต #{{record.mfId}}</h3>
          <ul class="text-left">
            <li>
              <b>ส่งงานภายใน:</b>
              <small>
                {{$moment(record.rwEndAt).subtract(2 ,'days').format('DD MMM YYYY')}}
                ({{$moment(record.rwEndAt).subtract(2 ,'days').fromNow()}}) เท่าน้น
              </small>
            </li>
            <li>จำนวนที่ได้รับทำ {{record.maxVolume}} รายการ</li>
            <li>เสร็จสิ้นแล้ว {{record.mfProgress}} รายการ</li>
          </ul>
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
          fluid
          size="huge"
          :disabled="onClickLoading"
          positive
          content="ส่งความคืบหน้า"
          class="ml-0"
          @click="onClickUpdateProgress"
          :loading="onClickLoading"
        />
      </sui-modal-actions>
    </sui-modal>
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
        amount: 1
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
    }
  },
  methods: {
    addAmount() {
      if (this.record) {
        return this.request.amount < this.record.maxVolume
          ? this.request.amount++
          : false;
      }
    },
    minusAmount() {
      return this.request.amount > 1 ? this.request.amount-- : false;
    },
    async toggle(record) {
      if (record) {
        this.request.amount = 1;
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
        case 1:
          set = {
            text: "ดำเนินการผลิต",
            color: "blue"
          };
          break;
        case 2:
          set = {
            text: "รอการตรวจสอบ",
            color: "black"
          };
          break;
        case 3:
          set = {
            text: "ดำเนินการแก้ไข",
            color: "orange"
          };
          break;
        case 4:
          set = {
            text: "เสร็จสิ้น",
            color: "green"
          };
          break;

        default:
          set = {
            text: "Rejected",
            color: "red"
          };
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
        self.$api
          .get(
            `/app/manufacture/${self.user.entId}/${self.apiKey}/${
              self.user.empId
            }`
          )
          .then(function(res) {
            if (res.data.length > 0) {
              self.items = res.data;
              resolve(res.data);
            } else {
              resolve();
            }
            self.onClickLoading = false;
            self.$store.commit("setLoading", false);
          });
      });
    },
    refresh(done) {
      this.fetch().then(function() {
        done();
      });
    },
    async onClickUpdateProgress() {
      let self = this;
      let data = this.record;

      this.onClickLoading = true;

      const UpdateProgress = await self.$api.put(
        `/app/manufacture/${self.app_Id}/progress`,
        {
          mfId: data.mfId,
          progress: this.request.amount
        }
      );

      if (UpdateProgress) {
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