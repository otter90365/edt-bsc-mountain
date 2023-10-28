<template>
  <div class="egt-index">
    <v-container>
      <v-row justify="space-between" align="center" align-md="start" class="w-100">
        <v-col cols="12" md="6" class="d-flex flex-md-column flex-column-reverse">
          <div class="d-md-none text-center white--text">
            <div class="rem-8 font-weight-bold mb-2 mb-md-4">{{ $t('homeTitle') }}</div>
            <div class="rem-12 font-weight-bold mb-md-15">{{ $t('homeSubtitle') }}</div>
          </div>
          <VueSlickCarousel class="carousel mb-11" ref="carousel" v-bind="settings">
            <img class="rounded-lg can-click" :src="`${require(`@/assets/img/${item.image}`)}`" v-for="(item, i) in slides" :key="i" width="100%"/>
          </VueSlickCarousel>
        </v-col>
        <v-col cols="12" md="6">
          <borderWrapCard v-for="card in cardData" :key="card.token" class="mb-6">
            <template #content>
              <div class="d-flex flex-md-row flex-column align-center">
                <img class="mr-0 mr-md-6 mb-6 mb-md-0" :src="require(`@/assets/img/icon-index-${card.token}.svg`)" :alt="`icon-${card.token}`" width="94px">
                <div class="d-flex flex-column align-center align-md-start">
                  <div class="rem-8 rem-md-12 font-weight-bold mb-1 secondary--text">{{ $t('successfullyBorrowAmount') }}</div>
                  <div class="rem-8 font-weight-bold mb-7 mb-md-3 text-left text-md-center warning--text">{{ totalAmount[card.token].toLocaleString() }} {{card.token.toUpperCase()}}</div>
                  <imgBtn dark :isCenter="false" :buttonText="$t('borrowMarket', {token: card.token.toUpperCase()})" @clickBtn="toLink(card.token)"></imgBtn>
                </div>
              </div>
            </template>
          </borderWrapCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import imgBtn from '@/components/imgBtn.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
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
          token: 'usdt',
          color: 'Green',
          gradient: ['#4c847c', '#0C5951'],
          logoBg: 'radial-gradient(66% 66% at 70% 34%, #00A77B 0%, #007959 100%)'
        }
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
        usdt: 0
      },
    }
  },
  components: {
    imgBtn,
    borderWrapCard,
    VueSlickCarousel
  },
  methods: {
    toLink(token){
      this.$router.push({name: "lang-token", params: {lang: this.$store.state.locale, token: token}})
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
    },
  },
  async mounted(){
    await this.getTotalAmount()
  }
}
</script>
<style lang="scss">
.egt-index{
  min-height: calc(100vh - 97px);
  padding: 70px 10%;
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
}
</style>