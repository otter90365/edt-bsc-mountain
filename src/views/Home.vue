<template>
  <div class="index">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <borderWrapCard class="mb-13">
          <template #content>
            <div class="d-flex flex-column justify-center align-center text-center">
              <titleBlock class="mb-6" title="indexTitle" subtitle="indexSubtitle" titleFontSize="rem-md-28"></titleBlock>
              <div class="rem-8 mb-1 font-weight-bold">{{ $t('investAmount') }}</div>
              <div class="rem-8 mb-4 border-secondary w-100" style="color: #E47E07;">{{ totalAmount.toLocaleString() }} {{ ($route.params.token).toUpperCase() }}</div>
              <imgBtn class="w-100 py-3" type="border-black" :buttonText="'swapEGT'" @clickBtn="toSwap()"></imgBtn>
            </div>
          </template>
        </borderWrapCard>
        <h2 class="rem-1 text-center white--text font-weight-regular">{{ $t('indexDesc') }}</h2>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import btn from "@/components/btn.vue";
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
import Game from "@/plugins/game.js";
import Defi from "@/plugins/defi.js";
export default {
  name: "Home",
  data(){
    return {
      gameContract: null,
      defiContract: null,
      totalAmount: '--',
      roundAmount: '--'
    }
  },
  components:{
    // btn,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  methods:{
    toGame(){
      if (this.$store.state.account){
        // this.$router.push({name: 'Game'})
        this.$toasted.error('因鏈上節點故障，彩金池維修中')
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    },
    toSwap(){
      if (this.$store.state.account){
        // this.$router.push({name: 'Egt-swap', params: {lang: this.$store.state.locale, token: this.$route.params.token}})
        this.$router.push({name: 'ComingSoon'})
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    },
    async getTotalAmount(){
      try{
        this.totalAmount = await this.defiContract.getTotalAmount()
      }catch(error){
        this.totalAmount = 0
        console.log('error', error)
      }
    },
    async getRoundAmount(){
      try{
        let round = await this.gameContract.getCurrRound()
        let detail = await this.gameContract.getRoundDetails(round)
        this.roundAmount = detail.roundamount
      }catch(error){
        this.roundAmount = 0
        console.log('error', error)
      }
    }
  },
  created(){
    if (!this.$store.state.tokens.includes(this.$route.params.token)){
      this.$router.push({name: "Index", params: {lang: this.$store.state.locale, token: this.$route.params.token}})
    }
  },
  async mounted(){
    // console.log('==========index==========')
    this.gameContract = await new Game()
    this.defiContract = await new Defi()
    await this.getTotalAmount()
    await this.getRoundAmount()
  }
}
</script>
<style lang="scss">
.index{
  .bsc-egt-block{
    width: 100%;
    border: 2px solid #0abbb5;
    border-radius: 10px;
  }
  .bsc-egt-block[data-type="tbt"]{
    border-color: #991594 !important;
  }
}
</style>