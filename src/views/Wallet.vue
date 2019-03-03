<template>
  <div v-if="!isLoading">
    <sui-container text v-if="!isLoading">
      <sui-card class="text-left mt-3" style="width: 100%">
        <sui-card-content>
          <sui-card-header>คงเหลือในบัญชี</sui-card-header>
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
            *ขั้นต่ำ 100 บาท -
            <small>อัพเดทเมื่อ: {{$moment().format("DD MMM YYYY HH:mm:ss น.")}}</small>
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
      fullSum: 0
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
            res.data.forEach(e => {
              if (e.workEarnType === 1) {
                total += e.workEarn * e.mfProgress;
              } else {
                total += e.workEarn * 1;
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

