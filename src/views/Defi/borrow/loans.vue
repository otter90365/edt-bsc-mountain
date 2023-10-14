<template>
  <div class="defi-borrow-loans-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-borrow-loans-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-borrow-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('myLoans') }}</h2>

          <div class="d-flex flex-column flex-md-row justify-center align-end align-md-center mb-2" style="width: 100%;">
            <div class="d-flex justify-center align-center mb-2 mb-md-0" style="width: 100%;">
              <div class="mr-3">{{ $t('loanToken') }}</div>
              <v-select
                v-model="search"
                outlined
                dense
                hide-details
                full-width
                :items="tokenItems"
                :item-text="'name'"
                :item-value="'value'"
                :color="`primary_${$route.params.token}`"
                :item-color="`primary_${$route.params.token}`"
              ></v-select>
            </div>
          </div>

          <div class="mb-8" style="width: 100%;">
            <noRecord v-if="currOrdersDetail.length === 0"></noRecord>
            <orderBlock v-for="(order, i) in currOrdersDetail" :key="i" mode="loan" :isLock="usdtAllowance===0 || usdtAllowance<usdtBalance" :data="order" :buttonText="order.canOrder ? 'edit':'payback'" @clickBtn="clickBtn(order)" @approve="approve()"></orderBlock>
          </div>

          <v-pagination
            v-if="currOrdersDetail.length !== 0"
            class="mb-8"
            v-model="currPage"
            :length="totalPage"
            :total-visible="7"
            :color="`primary_${$route.params.token}`"
          ></v-pagination>

          <btn class="mb-5" :buttonText="'createLoan'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="$router.push({name: 'Defi-borrow-create', params: {token: $route.params.token}})"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
    <v-dialog v-model="warningShow" :max-width="500" :width="'90%'">
      <v-card class="d-flex flex-column justify-center align-center pa-5" height="300">
        <div class="text-center">{{ $t('editWarning') }}</div>
        <div class="text-center mb-5">{{ $t('editSubWarning') }}</div>
        <div class="d-flex justify-center align-center">
          <btn class="mr-2" :buttonText="'edit'" @clickBtn="edit()"></btn>
          <btn :buttonText="'cancel'" isOutlined @clickBtn="warningShow=false"></btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import btn from '@/components/btn.vue'
import orderBlock from '@/components/orderBlock.vue'
import loading from '@/components/loading.vue'
import noRecord from '@/components/noRecord.vue'
import Defi from '@/plugins/defi.js'
import bscUsdt from '@/plugins/bscUsdt.js'
import bscTbt from '@/plugins/bscTbt.js'
export default {
  name: "Defi-borrow-loans",
  data (){
    return {
      defiContract: null,
      tokenContract: null,
      isMember: false,
      orders: [],
      currOrdersDetail: [],
      loadingShow: false,
      loadingText: '',
      warningShow: false,
      usdtBalance: 0,
      usdtAllowance: 0,
      order: {},
      timer: null,
      currPage: 1,
      search: '',
      tokenItems: []
    }
  },
  components:{
    btn,
    orderBlock,
    loading,
    noRecord
  },
  watch: {
    currPage: {
      handler: async function(){
        this.loadingShow = true
        await this.getOrderDetail()
        this.loadingShow = false
      }
    },
    search: {
      handler: async function(){
        this.loadingText = 'waitGetData'
        this.loadingShow = true
        await this.getSelfOrders()
        this.currPage = 1
        this.loadingShow = false
      }
    }
  },
  computed: {
    totalPage(){
      return Math.ceil(this.orders.length / this.dataPerPage)
    },
    dataPerPage(){
      return 10
    },
    currIndex(){
      let index = this.orders.slice(this.dataPerPage*(this.currPage-1), this.dataPerPage*this.currPage)
      return index
    }
  },
  methods:{
    async getSelfOrders(){
      let tokenOrders = await this.defiContract.getSelfOrders(this.search, 'borrower', this.$store.state.account)

      if (tokenOrders !== 'error'){
        this.orders = tokenOrders
        this.orders.sort((a, b)=>{
          return parseInt(b) - parseInt(a)
        })
        await this.getOrderDetail()
      }else{
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrdersDetail = []
      }
    },
    async getOrderDetail(){
      this.currOrdersDetail = await this.defiContract.getOrderDetail(this.search, this.currIndex, false, true, 'borrower')
    },
    async clickBtn(order){
      if (this.$store.state.chainId){
        if (order.canOrder){
          this.warningShow = true
          this.order = order
        }else{
          // 還款
          if (this.usdtBalance >= order.want){
            let result = await this.defiContract.payback(order.token, order.id)
            // console.log('result', result)
            if (result.txHash){
              this.$toasted.show(this.$t('txSend'))
            }else if (result.code === 4001){
              this.$toasted.error(this.$t('userRefuse'))
            }
          }else{
            this.$toasted.error(this.$t(`${this.$route.params.token.toUpperCase()}UnderBalance`))
          }
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async edit(){
      if (this.$store.state.chainId){
        let result = await this.defiContract.cancel(this.order.token, this.order.id)
        // console.log('result', result)
        if (result.txHash){
          this.$toasted.show(this.$t('txSend'))
          let token = this.$store.state.tokenList.find((item)=>item.tokenaddress === this.order.token)
          if (token){
            if (token.name === 'egt'){
              this.$router.push({name: `Defi-borrow-create-${token.name}`, params: {order: this.order}})
            }else{
              this.$router.push({name: `Defi-borrow-create-swapToken`, params: {token: this.$route.params.token, swapToken: token.name, order: this.order}})
            }
          }else{
            this.$toasted.show(this.$t('errorOccured'))
          }
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.tokenContract.approve()
        // console.log('result', result)
        if (result.txHash){
          this.loadingText = 'waitApprove'
          this.loadingShow = true
          let _this = this
          this.timer = window.setInterval(async () => {
            _this.usdtAllowance = await _this.tokenContract.getAllowance(this.$store.state.account)
            if (_this.usdtAllowance >= _this.usdtBalance) {
              window.clearInterval(_this.timer)
              _this.loadingShow = false
            }
          }, 1000)
        }else if (result.code === 4001){
          this.$toasted.error(this.$t('userRefuse'))
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    },
    async getUsdtAllowance(){
      this.usdtAllowance = await this.tokenContract.getAllowance(this.$store.state.account)
    },
  },
  async mounted(){
    // defi contract
    this.loadingText = 'waitGetData'
    this.loadingShow = true
    this.defiContract = await new Defi()
    let isMember = await this.defiContract.isMember(this.$store.state.account)
    if (isMember){
      if (this.$route.params.token === 'usdt'){
        this.tokenContract = await new bscUsdt()
      }else{
        this.tokenContract = await new bscTbt()
      }
      this.usdtBalance = await this.tokenContract.getBalance(this.$store.state.account)
      await this.getUsdtAllowance()

      for (let i=0; i<this.$store.state.tokenList.length; i++){
        this.tokenItems.push({
          name: this.$store.state.tokenList[i].name.toUpperCase(),
          value: this.$store.state.tokenList[i].tokenaddress
        })
      }
      this.search = this.tokenItems[0] ? this.tokenItems[0].value : ''

      // await this.getSelfOrders()
      this.loadingShow = false
    }else{
      this.$router.push({name: 'Defi-registry'})
    }
  }
}
</script>

<style lang="scss" scoped>
.defi-borrow-loans-page{
  
}
</style>