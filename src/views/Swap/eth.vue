<template>
  <div class="defi-swap-eth-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13">
          <template #content>
            <titleBlock class="mb-7" title="ETH / EGT"></titleBlock>

            <v-form ref="form" lazy-validation class="mb-5 w-100">
              <inputBlock
                title="tokenBalance"
                mode="onlyText"
                :inputText="$t('tokenBalanceAmount', {amount: ethBalance.toFixed(2).toLocaleString(), token: 'ETH'})"
              ></inputBlock>
              <inputBlock title="swapAmount" :unit="$t('piece')" mode="balance" :token="'egt'" :inputText.sync="amount" :disabled="allowance<balance" :balance="balance" :rules="[...TokenAmountRules]"></inputBlock>
            </v-form>

            <imgBtn class="mb-3" v-if="allowance===0 || allowance<balance" dark type="bg-black-sloped" buttonText="approve" @clickBtn="approve()"></imgBtn>
            <imgBtn class="mb-3" v-else dark type="bg-black-sloped" buttonText="apply" @clickBtn="swap()"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
  </div>
</template>
<script>
import EGTSwap from '@/plugins/egtSwap.js'
import EGT from '@/plugins/egt.js'
import ERC from '@/plugins/erc.js'
import inputBlock from '@/components/inputBlock.vue'
import loading from '@/components/loading.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
import base from '@/mixin/base.js'
export default {
  name: "Swap-eth",
  mixins: [base],
  data (){
    return {
      egtSwapContract: null,
      egtContract: null,
      ercContract: null,
      balance: 0,
      allowance: 0,
      ethBalance: 0,
      amount: '',
      loadingShow: false,
      loadingText: '',
      timer: null,
      isMember: false,
    }
  },
  components:{
    inputBlock,
    loading,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  methods:{
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.egtContract.approveOther(this.$store.state.EGTSwapAddress)
        // console.log('result', result)
        if (result.txHash){
          this.loadingShow = true
          this.loadingText = 'waitApprove'
          this.timer = window.setInterval(async () => {
            this.allowance = await this.egtContract.getOtherAllowance(this.$store.state.account, this.$store.state.EGTSwapAddress)
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
    async swap(){
      if (!this.isMember) { return }

      if (this.$store.state.chainId){
        if (this.$refs.form.validate()){
          let result = await this.egtSwapContract.sell(this.amount)
          // console.log('result', result)
          if (result.txHash){
            this.loadingShow = true
            this.loadingText = 'waitBuying'
            const oldBalance = this.balance
            this.timer = window.setInterval(async () => {
              await this.getBalance()
              if (this.balance > oldBalance) {
                window.clearInterval(this.timer)
                this.loadingShow = false
              }
            }, 1000)
          }else if (result.code === 4001){
            this.$toasted.error(this.$t('userRefuse'))
          }
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getBalance(){
      this.balance = await this.egtContract.getBalance(this.$store.state.account)
    },
    async getEthBalance(){
      this.ethBalance = await this.ercContract.getBalance(this.$store.state.account)
    }
  },
  async mounted(){
    this.egtSwapContract = await new EGTSwap()
    this.isMember = await this.egtSwapContract.isMember(this.$store.state.account)
    if (!this.isMember) {
      this.$router.push({name: 'Egt-registry'})
      return
    }

    if (this.$refs.form){
      this.$refs.form.resetValidation()
    }

    this.egtContract = await new EGT()
    this.getBalance()
    this.allowance = await this.egtContract.getOtherAllowance(this.$store.state.account, this.$store.state.EGTSwapAddress)

    const eth = this.$store.state.tokenList.find(item => item.name === 'eth')
    if (!eth) { return }
    this.ercContract = await new ERC(eth)
    this.getEthBalance()
  }
}
</script>

<style lang="scss" scoped>
.defi-swap-eth-page{
  
}
</style>