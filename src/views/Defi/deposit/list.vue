<template>
  <div class="defi-list-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13">
          <template #content>
            <titleBlock class="mb-4" title="orderList" icon="icon-deposit.svg"></titleBlock>
            <v-select
              class="mb-2 rounded-0"
              style="width: 100%;"
              v-model="searchType"
              outlined
              dense
              hide-details
              full-width
              :items="searchItems"
              item-text="name"
              item-value="value"
              color="primary"
              item-color="secondary"
            ></v-select>
            <div class="d-flex flex-column flex-md-row justify-center align-end align-md-center mb-2" style="width: 100%;">
              <div class="d-flex justify-center align-center mb-2 mb-md-0" style="width: 100%;">
                <v-select
                  v-if="searchType!=='token'"
                  class="mr-2 rounded-0"
                  style="max-width: 150px;"
                  v-model="filterType"
                  outlined
                  dense
                  hide-details
                  dark
                  :items="filterItem"
                  item-text="name"
                  item-value="value"
                  color="secondary"
                  background-color="secondary"
                  item-color="secondary"
                ></v-select>
                <v-text-field
                  v-if="searchType!=='token'"
                  class="mr-md-2 mr-0 rounded-0"
                  v-model="search"
                  outlined
                  dense
                  hide-details
                  full-width
                  @keydown="searchEnter"
                  color="primary"
                ></v-text-field>
                <v-select
                  v-else
                  class="mr-md-2 mr-0 rounded-0"
                  v-model="search"
                  outlined
                  dense
                  hide-details
                  full-width
                  :items="tokenItems"
                  item-text="name"
                  item-value="value"
                  color="primary"
                  item-color="secondary"
                ></v-select>
              </div>
              <btn isDark noRounded :buttonText="'filter'" color="secondary" @clickBtn="searchOrder()"></btn>
            </div>

            <div class="mb-8 w-100">
              <noRecord v-if="currOrders.length === 0"></noRecord>
              <orderBlock v-else v-for="(order, i) in currOrders" :key="i" :data="order" buttonText="invest" :isLock="usdtAllowance===0 || usdtAllowance<usdtBalance" @clickBtn="invest(order)" @approve="approve()"></orderBlock>
            </div>

            <v-pagination
              v-if="currOrders.length !== 0"
              class="mb-8"
              v-model="currPage"
              :length="totalPage"
              :total-visible="7"
              :color="`secondary`"
            ></v-pagination>

            <imgBtn class="mb-3" dark type="bg-black-sloped" buttonText="myDeposit" @clickBtn="$router.push({name: 'Defi-deposit-orders'})"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="loadingText"></loading>
    <warning :warningShow="warningShow" :page="'deposit'" @confirm="warningShow=false"></warning>
  </div>
</template>
<script>
import btn from '@/components/btn.vue'
import orderBlock from '@/components/orderBlock.vue'
import loading from '@/components/loading.vue'
import warning from '@/components/warning.vue'
import noRecord from '@/components/noRecord.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
import Defi from '@/plugins/defi.js'
import bscUsdt from '@/plugins/bscUsdt.js'
import base from '@/mixin/base.js'
export default {
  name: "Defi-deposit-list",
  mixins: [base],
  data (){
    return {
      defiContract: null,
      tokenContract: null,
      isMember: false,
      orders: [],
      filterOrders: [],
      currOrders: [],
      loadingShow: false,
      loadingText: '',
      warningShow: true,
      usdtBalance: 0,
      usdtAllowance: 0,
      timer: null,
      currPage: 1,
      searchType: 'id',
      filterType: 'more',
      search: '',
      searchItems: [
        {
          name: this.$t('id'),
          value: 'id'
        },
        {
          name: this.$t('loanDays'),
          value: 'settleday'
        },
        {
          name: this.$t('loanToken'),
          value: 'token'
        },
        {
          name: this.$t('loanAmount'),
          value: 'want'
        },
        {
          name: this.$t('loanMortgage'),
          value: 'mortgage'
        },
        {
          name: this.$t('loanRate'),
          value: 'rate'
        },
      ],
      filterItem: [
        {
          name: this.$t('more'),
          value: 'more'
        },
        {
          name: this.$t('less'),
          value: 'less'
        },
      ],
      tokenItems: [],
      gasNow: null,
      updateTime: null,
      gasLimit: 0,
    }
  },
  components:{
    btn,
    orderBlock,
    loading,
    warning,
    noRecord,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  watch: {
    search(newVal){
      if (!newVal){
        this.filterOrders = JSON.parse(JSON.stringify(this.orders))
      }
    },
    searchType(newVal){
      if (newVal === 'token'){
        this.search = this.$store.state.tokenList[0].tokenaddress
      }else{
        this.search = ''
      }
    },
    currPage(newVal){
      this.currOrders = this.filterOrders.slice(10 * (newVal-1), 10 * newVal)
    },
    "$store.state.locale":{
      handler: function(){
        this.searchItems = [
          {
            name: this.$t('id'),
            value: 'id'
          },
          {
            name: this.$t('loanDays'),
            value: 'settleday'
          },
          {
            name: this.$t('loanToken'),
            value: 'token'
          },
          {
            name: this.$t('loanAmount'),
            value: 'want'
          },
          {
            name: this.$t('loanMortgage'),
            value: 'mortgage'
          },
          {
            name: this.$t('loanRate'),
            value: 'rate'
          },
        ]

        this.filterItem = [
          {
            name: this.$t('more'),
            value: 'more'
          },
          {
            name: this.$t('less'),
            value: 'less'
          },
        ]
      }
    }
  },
  computed: {
    totalPage(){
      return Math.ceil(this.filterOrders.length / 10)
    }
  },
  methods:{
    async getMortgage(item){
      let token = this.$store.state.tokenList.find(t => (t.tokenaddress).toLowerCase() === (item.token).toLowerCase())
      let value, rate
      if (token){
        value = await this.getValue(token.name, item.Amount / (10 ** 18), this.$route.params.token);
        rate = await this.getRate(item.Want / (10 ** 18), value);
        return rate
      }
    },
    async getAllOrders(){
      try{
        let result = await this.$store.dispatch('getAllOrders')
        if (result.status === 200){
          if (result.data){
            let allOrders = []
            let data
            let _this = this
            for (let i=0; i<result.data.length; i++){
              if (result.data[i].token !== '0x0000000000000000000000000000000000000000'){
                let rate = await _this.getMortgage(result.data[i])
                data = {
                  amount: result.data[i].amount / (10 ** 18),
                  borrower: result.data[i].borrower,
                  id: result.data[i].id,
                  lender: result.data[i].lender,
                  rate: parseInt(result.data[i].rate) / (10 ** 16),
                  settleday: parseInt(result.data[i].settleday),
                  startday: parseInt(result.data[i].startday),
                  token: result.data[i].token,
                  want: result.data[i].want / (10 ** 18),
                  canOrder: true,
                  mortgage: rate ? parseFloat(rate) : null,
                }
                allOrders.push(data)
              }
            }
            this.orders = allOrders
            this.orders.sort((a, b)=>{
              return parseInt(a.id) - parseInt(b.id)
            })
            this.filterOrders = JSON.parse(JSON.stringify(this.orders))
            this.currOrders = this.filterOrders.slice(0, 10)
          }else{
            this.orders = []
            this.currOrders = []
            this.loadingShow = false
          }
        }else{
          this.$toasted.error(this.$t('errorOccured'))
          this.orders = []
          this.currOrders = []
          this.loadingShow = false
        }
      }catch(error){
        console.log('error', error)
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrders = []
        this.loadingShow = false
      }
    },
    searchOrder(){
      if (this.search){
        let _this = this
        if (this.searchType === 'settleday'){
          this.filterOrders = this.orders.filter(function(item){
            if (_this.filterType === 'more'){
              return item[_this.searchType] >= 24 * parseFloat(_this.search)
            }else{
              return item[_this.searchType] <= 24 * parseFloat(_this.search)
            }
          })
        }else if (this.searchType === 'rate'){
          this.filterOrders = this.orders.filter(function(item){
            if (_this.filterType === 'more'){
              return (item[_this.searchType])/2 >= parseFloat(_this.search)
            }else{
              return (item[_this.searchType])/2 <= parseFloat(_this.search)
            }
          })
        }else if (this.searchType === 'token'){
          this.filterOrders = this.orders.filter(function(item){
            return (item[_this.searchType]).toLowerCase() === (_this.search).toLowerCase()
          })
        }else{
          this.filterOrders = this.orders.filter(function(item){
            if (_this.filterType === 'more'){
              return parseFloat(item[_this.searchType]) >= parseFloat(_this.search)
            }else{
              return parseFloat(item[_this.searchType]) <= parseFloat(_this.search)
            }
          })
        }
        this.currOrders = this.filterOrders.slice(0, 10)
        this.currPage = 1
      }else{
        this.filterOrders = JSON.parse(JSON.stringify(this.orders))
        this.currOrders = this.filterOrders.slice(0, 10)
        this.currPage = 1
      }
    },
    searchEnter(e){
      if (e.keyCode === 13){
        this.searchOrder()
      }
    },
    async invest(item){
      if (this.isMember){
        if (this.$store.state.chainId){
          if (this.usdtBalance >= item.want){
            let result = await this.defiContract.selectOrder(item.token, parseInt(item.id))
            // console.log('result', result)
            if (result.txHash){
              this.$toasted.show(this.$t('txSend'))
            }else if (result.code === 4001){
              this.$toasted.error(this.$t('userRefuse'))
            }
          }else{
            this.$toasted.error(this.$t(`${this.$route.params.token.toUpperCase()}UnderBalance`))
          }
        }else{
          this.$toasted.error(this.$t('changeMainnet'))
        }
      }else{
        this.$toasted.error(this.$t('registryDeposit'))
      }
    },
    async getUsdtBalance(){
      this.usdtBalance = await this.tokenContract.getBalance(this.$store.state.account)
    },
    async getUsdtAllowance(){
      this.usdtAllowance = await this.tokenContract.getAllowance(this.$store.state.account)
    },
    async approve(){
      if (this.$store.state.chainId){
        let result = await this.tokenContract.approve()
        // console.log('result', result)
        if (result.txHash){
          this.loadingText = 'waitApprove'
          this.loadingShow = true
          this.timer = window.setInterval(async () => {
            this.usdtAllowance = await this.tokenContract.getAllowance(this.$store.state.account)
            if (this.usdtAllowance >= this.usdtBalance) {
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
    }
  },
  async mounted(){
    // defi contract
    this.loadingText = 'waitGetData'
    this.loadingShow = true
    this.defiContract = await new Defi()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
    
    await this.getAllOrders()
    this.tokenContract = await new bscUsdt()
    await this.getUsdtBalance()
    await this.getUsdtAllowance()

    this.tokenItems = this.$store.state.tokenList.map(item => ({
      name: item.name.toUpperCase(),
      value: item.tokenaddress
    }))

    this.gasLimit = await this.defiContract.getInvestGas()
    this.loadingShow = false
  },
  destroyed(){
    if (this.ws){
      this.ws.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.defi-list-page{
}
</style>