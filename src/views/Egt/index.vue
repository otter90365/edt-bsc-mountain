<!--<template>
  <div class="egt-buy-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="exchange-card card-wrap d-flex flex-column justify-center align-center">
          <img src="@/assets/img/icon-buy.png" width="60px" class="mb-5">
          <h2 class="primary--text mb-10">{{ $t('buyEGT') }}</h2>
          <addressBlock></addressBlock>

          <div>{{ $t('enterEthAmount') }}</div>
          <v-form ref="form" style="width: 100%;" lazy-validation>
            <v-text-field
              class="my-1"
              v-model="amount"
              outlined
              persistent-hint
              :hint="`Balance: ${balance} ETH`"
              color="primary"
              placeholder="0"
              :label="`${$t('enterExchangeEthAmount')}`"
              :rules="[...TokenAmountRules, ...balanceRules]"
            >
              <template v-slot:append>
                <div @click="amount=balance">Max</div>
              </template>
            </v-text-field>
          </v-form>

          <div class="primary--text  mb-10">{{ $t('canChange') }} {{ amount ? amount*1000 : 0 }} {{ $t('piece') }} EGT {{ $t('pieceBack') }} {{ $t('egtExchangeRate', {value: '1 : 1000'}) }}</div>

          <btn v-if="allowance===0 || allowance<balance" class="mb-5" :buttonText="'sellApprove'" :color="'red darken-1'" :isCenter="true" :width="270" @clickBtn="approve()"></btn>
          <btn v-else class="mb-5" :buttonText="'buy'" color="primary" :isCenter="true" :width="270" @clickBtn="clickBuyBtn()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitApprove'"></loading>
  </div>
</template>
<script>
import bscEth from "@/plugins/bscEth.js";
import EGT from "@/plugins/egt.js";
import base from '@/mixin/base.js'
import btn from '@/components/btn.vue'
import addressBlock from '@/components/addressBlock.vue'
import loading from '@/components/loading.vue'
export default {
  name: "Egt",
  mixins: [base],
  data (){
    return {
      amount: null,
      balance: 0,
      allowance: 0,
      ethContract: null,
      egtContract: null,
      loadingShow: false,
      timer: null,
      balanceRules: [
        (v) => v <= this.balance || 'Under Balance'
      ]
    }
  },
  components:{
    btn,
    addressBlock,
    loading,
  },
  methods:{
    async clickBuyBtn(){
      if (this.$refs.form.validate()){
        this.buyEGT()
      }
    },
    async buyEGT(){
      if (this.$store.state.chainId){
        let result = await this.egtContract.buy(this.amount)
        // console.log('result', result)
        if (result.txHash){
          await this.getBalance()
          this.$toasted.show(this.$t('txSend'))
          this.$refs.form.reset()
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getBalance(){
      let total = await this.ethContract.getBalance(this.$store.state.account)
      this.balance = total
    },
    async getAllowance(){
      let total = await this.ethContract.getAllowance(this.$store.state.account)
      this.allowance = total
    },
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.ethContract.approve()
        // console.log('result', result)
        if (result.txHash){
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.allowance = await this.ethContract.getAllowance(this.$store.state.account)
            if (this.allowance >= this.balance) {
              window.clearInterval(this.timer)
              this.loadingShow = false
            }
          }, 1000)
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
  },
  async mounted(){
    // egt contract
    this.egtContract = await new EGT()

    // egt isMember
    let isMember = await this.egtContract.isMember(this.$store.state.account)
    // console.log('isMember', isMember)
    
    if (isMember){
      this.ethContract = await new bscEth()
      this.getBalance()
      this.getAllowance()
    }else{
      this.$router.push({name: 'Egt-registry'})
    }
  }
}
</script>

<style lang="scss" scoped>
.egt-buy-page{
  
}
</style>-->