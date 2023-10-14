<template>
  <div class="defi-create-egt-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-create-egt-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-borrow-egt-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">EGT / {{ $route.params.token.toUpperCase() }}</h2>

          <v-form ref="form" lazy-validation style="width: 100%;" class="mb-5">
            <inputBlock title="loanToken" mode="onlyText" inputText="EGT"></inputBlock>
            <inputBlock title="loanTokenAmount" :unit="$t('piece')" mode="balance" :token="'egt'" :inputText.sync="loan.egtAmount" :disabled="allowance<balance?true:false" :balance="balance" :rules="[...TokenAmountRules]"></inputBlock>
            <inputBlock title="loanDays" :unit="$t('day')" mode="select" :inputText.sync="loan.date" :disabled="allowance<balance?true:false"></inputBlock>
            <inputBlock title="loanAmount" :unit="$route.params.token==='usdt'?'UT':'TBT'" :inputText.sync="loan.amount" :rules="[...TokenAmountRules]" :disabled="allowance<balance?true:false"></inputBlock>
            <inputBlock title="loanRate" unit="%" :inputText.sync="loan.interest" :rules="[...TokenAmountRules, ...rateRules]" :disabled="allowance<balance?true:false"></inputBlock>
            <inputBlock title="marketValue" :unit="$route.params.token==='usdt'?'UT':'TBT'" mode="onlyText" :inputText="value"></inputBlock>
            <inputBlock title="loanMortgage" unit="%" mode="onlyText" :inputText="rate"></inputBlock>
            <!--<div class="d-flex justify-space-between">
              <div>
                <span class="mr-10">{{ $t('gasNowEstimate') }}</span>
                <span class="gas-text error--text font-weight-bold">{{ gasNow }}</span>
              </div>
              <span>UT</span>
            </div>
            <div class="d-flex justify-center error--text subtitle-2 font-weight-bold text-center">
              {{ $t('gasWarning') }}
            </div>
            <div class="d-flex justify-end subtitle-2">
              {{ $t('priceUpdated') }} {{ timestampToTime(updateTime) }}
            </div>-->
          </v-form>

          <btn class="mb-5" v-if="allowance===0 || allowance<balance" :buttonText="'approve'" :color="'red darken-1'" :isCenter="true" :width="270" @clickBtn="approve()"></btn>
          <btn class="mb-5" v-else :buttonText="'apply'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="create()"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitApprove'"></loading>
    <warning :warningShow="warningShow" @confirm="warningShow=false"></warning>
  </div>
</template>
<script>
import Defi from '@/plugins/defi.js'
import EGT from '@/plugins/egt.js'
import inputBlock from '@/components/inputBlock.vue'
import btn from '@/components/btn.vue'
import loading from '@/components/loading.vue'
import warning from '@/components/warning.vue'
import base from '@/mixin/base.js'
export default {
  name: "Defi-borrow-create-egt",
  mixins: [base],
  data (){
    return {
      defiContract: null,
      egtContract: null,
      loan: {
        egtAmount: null,
        date: 7 * 24,
        amount: null,
        interest: null,
      },
      balance: 0,
      allowance: 0,
      loadingShow: false,
      warningShow: true,
      timer: null,
      value: null,
      rate: null,
      gasNow: null,
      updateTime: null,
      gasLimit: 0,
      isMember: false,
    }
  },
  watch:{
    "loan.egtAmount": {
      handler(){
        this.getEgtValue()
      }
    },
    "loan.amount": {
      handler(){
        this.getMorgageRate()
      }
    },
    value(){
      this.getMorgageRate()
    }
  },
  components:{
    inputBlock,
    btn,
    loading,
    warning
  },
  methods:{
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.egtContract.approve()
        // console.log('result', result)
        if (result.txHash){
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.allowance = await this.egtContract.getAllowance(this.$store.state.account)
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
    async getEgtValue(){
      this.value = await this.getValue('egt', this.loan.egtAmount, this.$route.params.token);
    },
    async getMorgageRate(){
      this.rate = await this.getRate(this.loan.amount, this.value);
    },
    async create(){
      if (this.isMember){
        if (this.$store.state.chainId){
          if (this.$refs.form.validate()){
            // console.log('loan', this.loan)
            this.loan.amount = parseFloat(this.loan.amount)
            this.loan.egtAmount = parseFloat(this.loan.egtAmount)
            this.loan.interest = parseFloat(this.loan.interest)

            let token = this.$store.state.tokenList.find((item)=>item.name === 'egt')
            let result = await this.defiContract.ercorder(this.loan, token.tokenaddress)
            // console.log('result', result)
            if (result.txHash){
              this.$toasted.show(this.$t('txSend'))
              this.$refs.form.reset()
              this.loan.date = 7 * 24
              await this.getBalance()
            }else if (result.code === 4001){
              this.$toasted.error(this.$t('userRefuse'))
            }
          }
        }else{
          this.$toasted.error(this.$t('changeMainnet'))
        }
      }else{
        this.$toasted.error(this.$t('registryBorrow'))
      }
    },
    async getBalance(){
      this.balance = await this.egtContract.getBalance(this.$store.state.account)
    },
    // Get 預估 gas
    connectGasWs(){
      let _this = this
      this.ws = new WebSocket(`wss://www.gasnow.org/ws`);
      this.ws.onopen = () => {
        // console.log('[Client] Successfully Connected', e)
      }
      this.ws.onmessage = async function(e) {
        let data = JSON.parse(e.data)
        // console.log('data', data)
        if (data.data && data.data.gasPrices){
          try{
            let result = await _this.$store.dispatch('getTokenPrice', {
              token: 'ethereum',
              currency: 'usd'
            })
            if (result){
              _this.gasNow = (parseFloat(data.data.gasPrices.standard / (10**18) * 300000) * result.ethereum.usd).toFixed(6)
              _this.updateTime = data.data.timestamp
            }else{
              this.$toasted.error(this.$t('cannotGetGas'))
              _this.gasNow = null
            }
          }catch(error){
            console.log('error', error)
          }
        }
      }
      this.ws.onclose = () => {
        if (this.$route.path === '/borrow/create/egt'){
          this.$toasted.error(this.$t('renewGetGas'))
        }
        console.log("closed");
      };
    },
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
    // if (this.isMember){
      if (this.$refs.form){
        this.$refs.form.resetValidation()
      }
      this.egtContract = await new EGT()
      this.getBalance()
      this.allowance = await this.egtContract.getAllowance(this.$store.state.account)
      this.gasLimit = await this.defiContract.getBorrowGas()
      this.connectGasWs()

      // 編輯訂單
      if (this.$route.params.order){
        this.loan = {
          egtAmount: this.$route.params.order.amount,
          date: this.$route.params.order.settleday,
          amount: this.$route.params.order.want,
          interest: this.$route.params.order.rate,
        }
      }
    // }else{
    //   this.$router.push({name: 'Defi-registry'})
    // }
  },
  destroyed(){
    if (this.ws){
      this.ws.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.defi-create-egt-page{
  
}
</style>