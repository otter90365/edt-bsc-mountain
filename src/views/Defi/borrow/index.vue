<template>
  <div class="defi-borrow-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13">
          <template #content>
            <titleBlock class="mb-8" title="toBorrow" icon="icon-borrow.svg"></titleBlock>
            <h2 class="rem-4 font-weight-bold mb-1 text-center">{{ $t('borrowRule') }}</h2>
            <p class="rem-0 font-weight-bold">
              <ol>
                <li v-for="(text, i) in $t(`borrowRuleText`)" :key="i" style="white-space: pre-wrap;" v-text="text"></li>
              </ol>
            </p>

            <v-row justify="center">
              <v-col cols="12" sm="6">
                <imgBtn class="mb-3" dark type="bg-black-sloped" buttonText="myLoans" @clickBtn="clickBtn('loans')"></imgBtn>
                <imgBtn class="mb-3" dark type="bg-black-sloped" buttonText="createLoan" @clickBtn="clickBtn('create')"></imgBtn>
                <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
              </v-col>
            </v-row>
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
    borderWrapCard,
    titleBlock,
    imgBtn
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