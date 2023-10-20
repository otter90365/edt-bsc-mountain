<template>
  <div class="defi-create-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 defi-create-card">
          <template #content>
            <titleBlock class="mb-4" title="createLoan" icon="icon-borrow.svg"></titleBlock>

            <v-row class="mb-15 w-100 mx-auto">
              <v-col cols="6" class="d-flex flex-column align-center">
                <div class="icon-block pa-2 d-flex flex-column justify-center align-center can-click mb-5"
                  :data-type="$route.params.token"
                  v-for="(item, i) in icons.filter(item=>ourToken.includes(item.name))"
                  :key="i"
                  @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)"
                >
                  <img :src="`${require(`@/assets/img/${item.img}`)}`" height="40px" class="rounded-circle mb-3 mt-3 mt-sm-0">
                  <div class="icon-text rem-0 rem-md-4 primary--text text-center">{{ item.text }}</div>
                </div>
              </v-col>
              <v-col cols="6" class="d-flex flex-column align-center">
                <div class="icon-block pa-2 d-flex flex-column justify-center align-center can-click mb-5"
                  v-for="(item, i) in icons.filter(item=>!ourToken.includes(item.name))"
                  :key="i"
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
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </div>
</template>
<script>
import Defi from '@/plugins/defi.js'
import loading from '@/components/loading.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
export default {
  name: "Defi-borrow-create",
  data (){
    return {
      defiContract: null,
      icons: [],
      loadingShow: false
    }
  },
  components:{
    loading,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  computed:{
    ourToken(){
      return ['egt', 'ebt']
    }
  },
  methods:{
    setToken(){
      // console.log('this.$store.state.tokenList', this.$store.state.tokenList)
      this.icons = []
      let list = this.$store.state.tokenList
      for (let i=0; i<list.length; i++){
        this.icons.push({
          name: list[i].name,
          img: `icon-${list[i].name}.svg`,
          text: `${(list[i].name).toUpperCase()} / ${this.$route.params.token.toUpperCase()}`,
          link: `/borrow/create/${list[i].name}`
        })
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    // let isMember = await this.defiContract.isMember(this.$store.state.account)
    // if (!isMember){
    //   this.$router.push({name: 'Defi-registry'})
    // }else{
      await this.setToken()
    // }
  }
}
</script>

<style lang="scss" scoped>
.defi-create-page{
  .defi-create-card{
    .icon-block{
      background: url(../../../../assets/img/deco-black-bg-white-line.svg) center / contain no-repeat;
      width: 180px;
      height: 180px;
      @media (max-width: 600px){
        width: 120px;
        height: auto;
        // height: 120px;
        max-width: 110%;
        .icon-text{
          text-overflow: ellipsis !important;
          text-align: left;
        }
      }
    }
    .icon-block[data-type="tbt"]{
      border-color: #991594 !important;
    }
  }
}
</style>