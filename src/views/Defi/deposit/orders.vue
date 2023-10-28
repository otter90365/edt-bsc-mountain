<template>
  <div class="defi-deposit-orders-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13">
          <template #content>
            <titleBlock class="mb-4" title="myDeposit" icon="icon-deposit.svg"></titleBlock>

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
                  item-text="name"
                  item-value="value"
                  color="secondary"
                  item-color="secondary"
                  class="rounded-0"
                ></v-select>
              </div>
            </div>

            <div class="mb-8 w-100">
              <noRecord v-if="currOrdersDetail.length === 0"></noRecord>
              <orderBlock v-for="(order, i) in currOrdersDetail" :key="i" :data="order" :buttonText="'withdraw'" @clickBtn="take(order)"></orderBlock>
            </div>

            <v-pagination
              v-if="currOrdersDetail.length !== 0"
              class="mb-8"
              v-model="currPage"
              :length="totalPage"
              :total-visible="7"
              color="secondary"
            ></v-pagination>

            <imgBtn class="mb-3" dark type="bg-black-sloped" buttonText="orderList" @clickBtn="$router.push({name: 'Defi-deposit-list'})"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>

          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </div>
</template>
<script>
import orderBlock from '@/components/orderBlock.vue'
import loading from '@/components/loading.vue'
import noRecord from '@/components/noRecord.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
import Defi from '@/plugins/defi.js'
export default {
  name: "Defi-deposit-orders",
  data (){
    return {
      defiContract: null,
      isMember: false,
      orders: [],
      currOrdersDetail: [],
      loadingShow: false,
      currPage: 1,
      search: '',
      tokenItems: []
    }
  },
  components:{
    orderBlock,
    loading,
    noRecord,
    borderWrapCard,
    titleBlock,
    imgBtn
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
      let tokenOrders = await this.defiContract.getSelfOrders(this.search, 'lender', this.$store.state.account)
      
      if (tokenOrders !== 'error'){
        this.orders = tokenOrders
        this.orders.sort((a, b)=>{
          return parseInt(b) - parseInt(a)
        })
        await this.getOrderDetail()
        // console.log('this.orders', this.orders)
      }else{
        this.$toasted.error(this.$t('errorOccured'))
        this.orders = []
        this.currOrdersDetail = []
      }
    },
    async getOrderDetail(){
      this.currOrdersDetail = await this.defiContract.getOrderDetail(this.search, this.currIndex, false, true, 'lender')
    },
    async take(order){
      if (this.$store.state.chainId){
        let result = await this.defiContract.take(order.token, order.id)
        // console.log('result', result)
        if (result.txHash){
          this.$toasted.show(this.$t('txSend'))
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
    this.loadingShow = true
    this.defiContract = await new Defi()
    let isMember = await this.defiContract.isMember(this.$store.state.account)
    if (isMember){
      this.tokenItems = this.$store.state.tokenList.map(item => ({
        name: item.name.toUpperCase(),
        value: item.tokenaddress
      }))
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
.defi-deposit-orders-page{
  
}
</style>