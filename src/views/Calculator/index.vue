<template>
  <div class="calculator-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 calculator-card">
          <template #content>
            <titleBlock class="mb-8" title="calculator" icon="icon-calculator.svg"></titleBlock>

            <div class="d-flex justify-space-around align-center mb-15">
              <div class="icon-block d-flex flex-column justify-center align-center can-click"
                :data-type="$route.params.token"
                :class="{'ml-sm-10 ml-3':i!==0}"
                v-for="(item, i) in icons"
                :key="i"
                @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)">
                <img :src="`${require(`@/assets/img/${item.img}`)}`" :width="$store.state.nowWidth > 600 ? '60px' : '40px'" class="rounded-circle mb-1 mb-sm-3">
                <div class="primary--text">{{ item.text }}</div>
              </div>
            </div>

            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import borderWrapCard from '@/components/borderWrapCard'
import titleBlock from '@/components/titleBlock'
import imgBtn from '@/components/imgBtn'
export default {
  data (){
    return {
      icons: [
        {
          img: 'icon-twd.svg',
          text: 'EGT / TWD',
          link: '/calculator/twd',
        },
        {
          img: 'icon-usdt.svg',
          text: 'EGT / USDT',
          link: '/calculator/usdt',
        }
      ]
    }
  },
  components: {
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  async mounted(){
    
  }
}
</script>
<style lang="scss">
.calculator-page{
  .calculator-card{
    .icon-block{
      background: url(../../assets/img/deco-black-bg-white-line.svg) center / contain no-repeat;
      width: 180px;
      height: 180px;
      @media (max-width: 600px){
        width: 120px;
        height: 120px;
      }
    }
  }
}
</style>