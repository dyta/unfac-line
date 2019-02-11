<template>
  <div class="page" v-if="verify">
    <sui-container text class="text-left content" v-if="!isLoading && items.length > 0">
      {{items}}
      <sui-card v-for="(item, index) in items" :key="index">
        <sui-card-content>
          <sui-card-header>Ellidddot Fu</sui-card-header>
          <sui-card-meta>Friend</sui-card-meta>
          <sui-card-description>Elliot Fu is a film-maker from New York.</sui-card-description>
        </sui-card-content>
        <sui-button-group attached="bottom">
          <sui-button>
            <sui-icon name="info"/>รายละเอียด
          </sui-button>
          <sui-button color="green">
            <sui-icon name="add"/>ขอรับงานนี้
          </sui-button>
        </sui-button-group>
      </sui-card>
    </sui-container>
    <sui-container class="content" v-else-if="items.length === 0 && !isLoading">
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
    async fetch() {
      let self = this;
      this.$store.commit("setLoading", true);
      await this.$api
        .get(`/app/work/${this.$store.state.user.entId}`)
        .then(function(res) {
          if (res.length > 0) {
            self.items = res;
          }
          self.$store.commit("setLoading", false);
        });
    }
  }
};
</script>
