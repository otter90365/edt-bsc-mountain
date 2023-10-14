<template>
  <div class="egt-index">
    <v-container>
      <v-row justify="space-between" align="center" class="w-100">
        <v-col cols="12" md="6" class="d-flex flex-md-column flex-column-reverse">
          <div>
            <div class="lightGrey--text text-md-center rem-2 rem-md-6 mb-2 mb-md-4">{{ $t('homeTitle') }}</div>
            <div class="pink--text text-md-center rem-12 rem-md-24 mb-md-15">{{ $t('homeSubtitle') }}</div>
          </div>
          <VueSlickCarousel class="carousel mb-11" ref="carousel" v-bind="settings">
            <img class="rounded-lg can-click" :src="`${require(`@/assets/img/${item.image}`)}`" v-for="(item, i) in slides" :key="i" width="100%"/>
          </VueSlickCarousel>
          <btn class="d-none d-md-block btn-to-swap" :gradientColor="'linear-gradient(to right, #4FC987, #0A6C2F)'" isRounded isBlock isCustom :height="66" @clickBtn="toSwapWeb()">
            <template v-slot:custom>
              <div class="rem-20 swap-text">{{ $t('toSwap') }}</div>
              <div class="go-wrap rounded-circle darkGreen--text rem-12 d-flex justify-center align-center">GO</div>
            </template>
          </btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="d-flex flex-column align-center py-10 mb-6" :img="`${require(`@/assets/img/img-${card.token}-market.png`)}`" v-for="card in cardData" :key="card.token">
            <logo class="mb-5" :name="card.token" :background="card.logoBg" :img="`icon-${card.token}-text.png`"></logo>
            <div class="rem-4 rem-md-12" :class="`dark${card.color}--text`">{{ $t('successfullyBorrowAmount') }}</div>
            <div class="rem-12 rem-md-30 mb-5 text-center" :class="`${(card.color).toLowerCase()}--text`">{{ totalAmount[card.token].toLocaleString() }} {{card.token.toUpperCase()}}</div>
            <btn :gradientColor="`linear-gradient(to right, ${card.gradient[0]}, ${card.gradient[1]})`" :buttonText="$t('borrowMarket', {token: card.token.toUpperCase()})" isRounded :height="$store.state.nowWidth>960?60:40" @clickBtn="toLink(card.token)"></btn>
          </v-card>
          <btn class="d-block d-md-none btn-to-swap" :gradientColor="'linear-gradient(to right, #4FC987, #0A6C2F)'" isRounded isBlock isCustom :height="43" @clickBtn="toSwapWeb()">
            <template v-slot:custom>
              <div class="rem-10 swap-text">{{ $t('toSwap') }}</div>
              <div class="go-wrap rounded-circle darkGreen--text rem-2 d-flex justify-center align-center">GO</div>
            </template>
          </btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import logo from '@/components/logo.vue'
import btn from '@/components/btn.vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import Defi from "@/plugins/defi.js";
export default {
  data(){
    return {
      slides: [
        {
          image: 'banner1.png'
        },
        {
          image: 'banner1.png'
        },
        {
          image: 'banner1.png'
        },
        {
          image: 'banner1.png'
        },
      ],
      cardData: [
        {
          token: 'tbt',
          color: 'Purple',
          gradient: ['#27ABC8', '#020C4F'],
          logoBg: 'radial-gradient(66% 66% at 70% 34%, #27ABC8 0%, #020C4F 100%)'
        },
        {
          token: 'usdt',
          color: 'Green',
          gradient: ['#4c847c', '#0C5951'],
          logoBg: 'radial-gradient(66% 66% at 70% 34%, #00A77B 0%, #007959 100%)'
        },
      ],
      // slide settings
      settings: {
        arrows: false,
        dots: true,
        dotsClass: "slick-dots",
        edgeFriction: 0.35,
        infinite: false,
        speed: 500,
        autoplaySpeed: 5000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        pauseOnFocus: true,
        pauseOnHover: true,
      },
      totalAmount: {
        usdt: 0,
        tbt: 0,
      },
    }
  },
  components: {
    logo,
    btn,
    VueSlickCarousel
  },
  methods: {
    toLink(token){
      this.$router.push({name: "lang-token", params: {lang: this.$store.state.locale, token: token}})
    },
    toSwapWeb(){
      window.open(`https://bep20swaput.com/${this.$store.state.locale}`)
    },
    async getTotalAmount(){
      try{
        await this.$store.commit('updateCurrToken', 'usdt')
        await this.$store.dispatch('getDefiContract')
        this.defiContract = new Defi()
        this.totalAmount.usdt = await this.defiContract.getTotalAmount()
      }catch(error){
        this.totalAmount.usdt = 0
        console.log('error', error)
      }
      try{
        await this.$store.commit('updateCurrToken', 'tbt')
        await this.$store.dispatch('getDefiContract')
        this.defiContract = new Defi()
        this.totalAmount.tbt = await this.defiContract.getTotalAmount()
      }catch(error){
        this.totalAmount.tbt = 0
        console.log('error', error)
      }
    },
  },
  async mounted(){
    await this.getTotalAmount()
  }
}
</script>
<style lang="scss">
.egt-index{
  min-height: 100vh;
  padding: 70px 10%;
  background:
    url('../assets/img/bg-flow.svg') no-repeat bottom,
    linear-gradient(90deg, #181439 1.67%, #5C289D 98.33%);
  @include dai_vuetify_md{
    padding: 16px 20px;
  }

  .slick-dots{
    li button:before{
      color: #C4C4C4;
      opacity: 55%;
      width: 9px;
      height: 9px;
    }
    li.slick-active button:before{
      color: #606060;
      opacity: 100%;
    }
  }
  .btn-to-swap{
    position: relative;
    .swap-text{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .go-wrap{
      width: 53px;
      height: 53px;
      background: white;
      position: absolute;
      right: -5px;
      @include dai_vuetify_md{
        width: 31px;
        height: 31px;
      }
    }
  }
}
</style>