<template>
  <v-app class="app">
    <v-app-bar
      v-if="$route.name==='Index'"
      class="app-bar"
      app
      dark
      :height="$store.state.nowWidth>960?97:''"
      :dense="$store.state.nowWidth<=960"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Edt-Logo"
          class="shrink mr-0 mr-md-2"
          contain
          src="@/assets/img/logo-egtdefi.png"
          transition="scale-transition"
          :height="$store.state.nowWidth>960?60:30"
        />
        <span><span class="rem-6 rem-md-24 mr-1 mr-md-2">{{ $t('title')[0] }}</span><span class="rem-2 rem-md-12">{{ $t('title')[1] }}</span></span>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <btn class="no-padding-btn" isText :buttonText="$store.state.account? `${$store.state.nowWidth>960?`${shortAddress} ${$t('logout')}`:`${$t('logout')}`}` : `${$t('login')}`" :color="'white'" @clickBtn="log()"></btn>
        <v-menu
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <span class="no-padding-btn">
              <v-btn
                color="white"
                v-bind="attrs"
                v-on="on"
                text
              >
                <v-icon dark>
                  mdi-translate
                </v-icon>
              </v-btn>
            </span>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in $store.state.langs"
              :key="index"
              class="can-click"
              @click="changeLang(item)"
            >
              <v-list-item-title>{{ $t(item) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main id="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import btn from '@/components/btn.vue';
import base from '@/mixin/base'
export default {
  name: 'App',
  mixins: [base],
  data: () => ({
  }),
  components:{
    btn
  },
  computed:{
    shortAddress(){
      return `${this.$store.state.account.slice(0, 6)}...${this.$store.state.account.slice(38)}`
    }
  },
  methods:{
    async log(){
      if (this.$store.state.account){
        this.$store.commit('clearInfo')
        this.$cookies.remove('address')
        this.$router.push({name: 'Home'})
      }else{
        if (window.ethereum) {
          await this.connectMetamask()
        } else {
          window.addEventListener('ethereum#initialized', this.connectMetamask, {
            once: true,
          });

          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.connectMetamask, 2000); // 3 seconds
        }
        this.$forceUpdate()
      }
    },
    changeLang(lang){
      this.$store.commit('updateLang', lang)
      this.$i18n.locale = lang
      this.$router.push({ name: this.$route.name, params: {lang: lang, token: this.$route.params.token} });
    },
  },
  async mounted(){
    // console.log('==========default==========')
    let _this = this

    this.$store.commit('updateNowWidth', document.body.clientWidth)
    window.onresize = () => {
      this.$store.commit('updateNowWidth', document.body.clientWidth)
    }

    if (window.ethereum){
      // metamask disconnect
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0){
          this.$cookies.remove('address')
          this.$store.commit('clearInfo')
          this.$toasted.error(_this.$t('connectionBreak'))
        }else{
          this.$store.commit('updateAccount', accounts[0]);
          this.$cookies.set('address', accounts[0]);
          this.$toasted.show(_this.$t('changeWallet'));
          window.location.reload()
        }
      });

      // get chain id
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.checkChainId(chainId)
      window.ethereum.on('chainChanged', _this.checkChainId);

      if (!window.ethereum.selectedAddress){
        let address = this.$cookies.get('address')
        if (address){
          this.$cookies.remove('address')
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '../src/assets/scss/font.scss';
// layout
.app{
  font-family: Roboto;
}
#main{
  background: url('../src/assets/img/background.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.app-bar{
  background: linear-gradient(to right, #D784B7, #423787) !important;
  .v-toolbar__content{
    @include dai_vuetify_sm{
      padding-left: 0;
      padding-right: 0;
    }
  }
  .no-padding-btn{
    .v-btn:not(.v-btn--round).v-size--default{
      @include dai_vuetify_sm{
        min-width: 40px;
        padding: 0 10px;
      }
    }
  }
}
.card-wrap{
  padding: 40px 60px;
  box-shadow: 0 4px 16px 4px rgb(0 0 0 / 20%) !important;
  @media (max-width: 600px){
    padding: 40px 20px;
  }
}
// common style
.text-shadow{
  text-shadow: 0 2px 5px #333;
}
.gas-text{
  font-size: 24px;
}
.can-click{
  cursor: pointer;
}
.toasted.toasted-primary.error{
  background-color: #E53935 !important;
}
.toasted.toasted-primary.default{
  background-color: #0abbb5 !important;
}
</style>