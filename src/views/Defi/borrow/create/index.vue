<template>
  <div class="defi-create-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-create-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-borrow-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('createLoan') }}</h2>

          <v-row class="mb-15" style="width: 100%;">
            <v-col cols="6" class="d-flex flex-column align-center">
              <div class="icon-block pa-2 d-flex flex-column justify-center align-center can-click mb-5"
                :data-type="$route.params.token"
                v-for="(item, i) in icons.filter(item=>ourToken.includes(item.name))"
                :key="i"
                @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)"
              >
                <img :src="`${require(`@/assets/img/${item.img}`)}`" width="60px" class="rounded-circle mb-3">
                <div class="icon-text text-center">{{ item.text }}</div>
              </div>
            </v-col>
            <v-col cols="6" class="d-flex flex-column align-center">
              <div class="icon-block pa-2 d-flex flex-column justify-center align-center can-click mb-5"
                v-for="(item, i) in icons.filter(item=>!ourToken.includes(item.name))"
                :key="i"
                @click="$router.push(`/${$route.params.lang}/${$route.params.token}${item.link}`)"
              >
                <img :src="`${require(`@/assets/img/${item.img}`)}`" width="60px" class="rounded-circle mb-3">
                <div class="icon-text text-center">{{ item.text }}</div>
              </div>
            </v-col>
          </v-row>

          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </div>
</template>
<script>
import Defi from '@/plugins/defi.js'
import loading from '@/components/loading.vue'
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
    loading
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
          img: `icon-${list[i].name}.png`,
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
      width: 180px;
      height: 180px;
      border: 1px solid #0abbb5;
      border-radius: 10px;
      @media (max-width: 600px){
        width: 120px;
        height: auto;
        // height: 120px;
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