<template>
  <div class="defi-borrow-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-borrow-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-borrow-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('toBorrow') }}</h2>
          <h3 class="mb-3" :class="`primary_${$route.params.token}--text`">{{ $t('borrowRule') }}</h3>
          <ol class="mb-5">
            <li v-for="(text, i) in $t('borrowRuleText')" :key="i" style="white-space: pre-wrap;" v-text="text"></li>
          </ol>

          <btn class="mb-5" :buttonText="'myLoans'" :color="`primary_${$route.params.token}`" isOutlined :isCenter="true" :width="270" @clickBtn="clickBtn('loans')"></btn>
          <btn class="mb-5" :buttonText="'createLoan'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="clickBtn('create')"></btn>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import btn from '@/components/btn.vue'
import Defi from '@/plugins/defi.js'
export default {
  name: "Defi-borrow",
  data (){
    return {
      defiContract: null,
      isMember: false,
    }
  },
  components:{
    btn,
  },
  methods:{
    async clickBtn(link){
      if (this.$store.state.account){
        // defi isMember
        if (this.isMember || link === 'create'){
          this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/borrow/${link}`)
        }else{
          this.$router.push({name: 'Defi-registry', params: {from: 'borrow'}})
        }
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
  }
}
</script>

<style lang="scss" scoped>
.defi-borrow-page{
  
}
</style>