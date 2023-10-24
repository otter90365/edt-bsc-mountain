<template>
  <div class="defi-registry-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 text-center">
          <template #content>
            <titleBlock class="mb-4" :title="$route.params.from === 'deposit' ? 'toDeposit' : 'toBorrow'" icon="icon-registry.svg"></titleBlock>
            <div class="red--text mb-10">{{ $route.params.from === 'deposit' ? $t('registryDeposit') : $t('registryBorrow') }}</div>

            <div>{{ $t('enterReferer') }}</div>
            <v-form ref="form" lazy-validation class="w-100">
              <v-text-field
                class="mb-2"
                v-model="referer"
                :color="`primary_${$route.params.token}`"
                placeholder="0x..."
                :rules="[...accountRules]"
              ></v-text-field>
            </v-form>

            <addressBlock></addressBlock>

            <imgBtn class="mb-3" dark type="bg-black-sloped" buttonText="registry" @clickBtn="register()"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitRegistry'"></loading>
  </div>
</template>
<script>
import base from '@/mixin/base.js'
import Defi from "@/plugins/defi.js";
import addressBlock from '@/components/addressBlock.vue'
import loading from '@/components/loading.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
export default {
  name: 'Defi-registry',
  mixins: [base],
  data (){
    return {
      referer: '',
      isMember: false,
      timer: null,
      loadingShow: false,
    }
  },
  components:{
    addressBlock,
    loading,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  methods:{
    async register(){
      if (this.$store.state.chainId){
        if (this.$refs.form.validate()){
          if (this.isMember){
            this.$toasted.error(this.$t('addressHasUsed'))
          }else{
            let result = await this.defiContract.register(this.referer)
            // console.log('result', result)
            if (result.txHash){
              this.loadingShow = true
              this.timer = window.setInterval(async () => {
                this.isMember = await this.defiContract.isMember(this.$store.state.account)
                if (this.isMember) {
                  window.clearInterval(this.timer)
                  this.loadingShow = false
                  this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/${this.$route.params.from ? this.$route.params.from : 'deposit'}`)
                }
              }, 1000)
            }else if (result.code === 4001){
              this.$toasted.error(this.$t('userRefuse'))
            }
          }
        }
      }else{
        this.$toasted.error(this.$t('changeMainnet'))
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()

    // defi isMember
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
    if (this.isMember){
      this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/${this.$route.params.from ? this.$route.params.from : 'deposit'}`)
    }
  }
}
</script>
<style lang="scss">
.defi-registry-page{
  
}
</style>