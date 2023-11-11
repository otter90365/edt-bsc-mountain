<template>
  <div class="defi-swap-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 defi-swap-card">
          <template #content>
            <titleBlock class="mb-4" title="swapTitle"></titleBlock>

            <v-row class="mb-10 w-100 mx-auto">
              <v-col
                cols="6"
                class="d-flex flex-column align-center"
                v-for="(item, i) in icons"
                :key="i"
              >
                <div class="icon-block pa-2 d-flex flex-column justify-center align-center can-click mb-5"
                  :data-type="$route.params.token"                  
                  @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)"
                >
                  <img :src="`${require(`@/assets/img/${item.img}`)}`" height="40px" class="rounded-circle mb-3 mt-3 mt-sm-0">
                  <div class="icon-text rem-0 rem-md-4 primary--text text-center">{{ item.text }}</div>
                </div>
              </v-col>
            </v-row>

            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
export default {
  name: "Swap",
  data (){
    return {
      icons: [
        {
          name: 'egt',
          img: `icon-eth.svg`,
          text: `EGT / ETH`,
          link: `/swap/egt`
        },
        {
          name: 'eth',
          img: `icon-egt.svg`,
          text: `ETH / EGT`,
          link: `/swap/eth`
        }
      ],
    }
  },
  components:{
    borderWrapCard,
    titleBlock,
    imgBtn
  }
}
</script>

<style lang="scss" scoped>
.defi-swap-page{
  .defi-swap-card{
    .icon-block{
      background: url(../../assets/img/deco-black-bg-white-line.svg) center / contain no-repeat;
      width: 180px;
      height: 180px;
      @media (max-width: 600px){
        width: 120px;
        height: auto;
        max-width: 110%;
        .icon-text{
          text-overflow: ellipsis !important;
          text-align: left;
        }
      }
    }
  }
}
</style>