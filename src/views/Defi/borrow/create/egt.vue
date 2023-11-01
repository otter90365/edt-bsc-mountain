<template>
  <div class="defi-create-egt-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 defi-create-egt-card">
          <template #content>
            <titleBlock class="mb-7" :title="`EGT / ${$route.params.token.toUpperCase()}`" :icon="`icon-borrow-egt-${$route.params.token}.svg`"></titleBlock>

            <v-form ref="form" lazy-validation class="mb-5 w-100">
              <inputBlock title="loanToken" mode="onlyText" inputText="EGT"></inputBlock>
              <inputBlock title="loanTokenAmount" :unit="$t('piece')" mode="balance" :token="'egt'" :inputText.sync="loan.egtAmount" :disabled="allowance<balance?true:false" :balance="balance" :rules="[...TokenAmountRules]"></inputBlock>
              <inputBlock title="loanDays" :unit="$t('day')" darkBg mode="select" :inputText.sync="loan.date" :disabled="allowance<balance?true:false" :rules="[dataRules]"></inputBlock>
              <inputBlock title="loanAmount" :unit="$route.params.token==='usdt'?'UT':'TBT'" :inputText.sync="loan.amount" :rules="[...TokenAmountRules]" :disabled="allowance<balance?true:false"></inputBlock>
              <inputBlock title="loanRate" unit="%" :inputText.sync="loan.interest" :rules="[...TokenAmountRules, ...rateRules]" :disabled="allowance<balance?true:false"></inputBlock>
              <inputBlock title="marketValue" :unit="$route.params.token==='usdt'?'UT':'TBT'" darkBg mode="onlyText" :inputText="value"></inputBlock>
              <inputBlock title="loanMortgage" unit="%" darkBg mode="onlyText" :inputText="rate"></inputBlock>
            </v-form>

            <imgBtn class="mb-3" v-if="allowance===0 || allowance<balance" dark type="bg-black-sloped" buttonText="approve" @clickBtn="approve()"></imgBtn>
            <imgBtn class="mb-3" v-else dark type="bg-black-sloped" buttonText="apply" @clickBtn="create()"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
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
import loading from '@/components/loading.vue'
import warning from '@/components/warning.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
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
        date: 7 * 24 * 60 * 60,
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
    loading,
    warning,
    borderWrapCard,
    titleBlock,
    imgBtn
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

            let token = this.$store.state.tokenList.find((item)=>(item.name).toLowerCase() === 'egt')
            let result = await this.defiContract.ercorder(this.loan, token.tokenaddress)
            // console.log('result', result)
            if (result.txHash){
              this.$toasted.show(this.$t('txSend'))
              this.$refs.form.reset()
              this.loan.date = 7 * 24 * 60 * 60
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
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)

    if (this.$refs.form){
      this.$refs.form.resetValidation()
    }
    this.egtContract = await new EGT()
    this.getBalance()
    this.allowance = await this.egtContract.getAllowance(this.$store.state.account)
    this.gasLimit = await this.defiContract.getBorrowGas()

    // 編輯訂單
    if (this.$route.params.order){
      this.loan = {
        egtAmount: this.$route.params.order.amount,
        date: this.$route.params.order.settleday,
        amount: this.$route.params.order.want,
        interest: this.$route.params.order.rate,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.defi-create-egt-page{
  
}
</style>