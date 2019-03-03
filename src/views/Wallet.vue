<template>
  <div v-if="!isLoading">
    <sui-container text v-if="!isLoading">
      <sui-card class="text-left mt-2" style="width: 100%; box-shadow: none">
        <sui-card-content>
          <sui-card-header>
            คงเหลือในบัญชี
            <small style="font-size: 10px">หัก {{tax}}%</small>
          </sui-card-header>
        </sui-card-content>
        <sui-card-content>
          <sui-statistic horizontal color="green">
            <sui-statistic-label>฿</sui-statistic-label>
            <sui-statistic-value>{{sum}}</sui-statistic-value>
          </sui-statistic>
        </sui-card-content>
        <sui-card-content extra>
          <sui-button
            fluid
            :disabled="fullSum < 1"
            :positive="fullSum > 99"
            @click="withdraw"
          >เบิกเงิน*</sui-button>
          <small>
            <small>*ขั้นต่ำ 100 บาท - อัพเดทเมื่อ: {{$moment().format("DD MMM YYYY HH:mm:ss น.")}}</small>
          </small>
        </sui-card-content>
      </sui-card>
    </sui-container>
  </div>
</template>

<script>
export default {
  name: "account",
  data() {
    return {
      sum: 0,
      fullSum: 0,
      tax: 0
    };
  },
  created() {
    this.wallet();
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
    async wallet() {
      let self = this;
      self.$store.commit("setLoading", true);
      self.$api
        .get(`/app/wallet/${self.user.entId}/${self.user.empId}`)
        .then(function(res) {
          if (res.data.length > 0) {
            let total = 0;
            self.tax = res.data[0].workTAX;
            res.data.forEach(e => {
              if (e.workEarnType === 1) {
                total +=
                  e.workEarn * e.mfProgress -
                  (e.workEarn * e.mfProgress * e.workTAX) / 100;
              } else {
                total += e.workEarn * 1 - (e.workEarn * 1 * e.workTAX) / 100;
              }
            });
            let val = (total / 1).toFixed(2).replace(",", ".");
            self.fullSum = val;
            self.sum = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          self.$store.commit("setLoading", false);
        });
    },
    withdraw() {
      alert("Not Available.");
    }
  }
};
</script>

