<template>
  <div class="calculator-twd-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13 calculator-card">
          <template #content>
            <titleBlock class="mb-8" :title="$t('swapCalculateTitle', {token1: 'EGT', token2: 'TWD'})" :subtitle="$t('egtExchangeRate', {value: '1 : 1200'})" icon="icon-twd-black.svg"></titleBlock>

            <v-row class="mb-10">
              <v-col cols="12">
                <v-form ref="form" lazy-validation class="d-flex flex-column justify-center align-center">
                  <v-text-field
                    v-model="egtAmount"
                    style="width: 250px;"
                    class="rounded-0"
                    outlined
                    dense
                    full-width
                    color="secondary"
                    placeholder="0"
                    label="EGT"
                    :rules="[...TokenAmountRules]"
                    @keydown.enter.prevent="calculate()"
                  >
                  </v-text-field>
                  <v-icon class="mb-n3" color="secondary">mdi-chevron-up</v-icon>
                  <v-icon class="mb-5" color="secondary">mdi-chevron-down</v-icon>
                  <div class="d-flex flex-column align-center">
                    <div>TWD {{ $t('amount') }}</div>
                    <h2 class="secondary--text">{{ twdResult || '--'}} {{ $t('dollar') }}</h2>
                  </div>
                </v-form>
              </v-col>
            </v-row>

            <div v-if="updateTime" class="mb-3 red--text text-caption text-right w-100">{{ $t('dataUpdated') }} {{ timestampToTime(updateTime) }}</div>
            <imgBtn class="mb-5" dark type="bg-black-sloped" buttonText="calculate" @clickBtn="calculate()"></imgBtn>
            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import base from '@/mixin/base.js'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
export default {
  name: 'Calculator-twd',
  mixins: [base],
  data (){
    return {
      egtAmount: null,
      twdResult: null,
      updateTime: null,
    }
  },
  components:{
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  methods:{
    async calculate(){
      if (this.$refs.form.validate()){
        let data = {
          token: 'ethereum',
          currency: 'twd'
        }
        try{
          let result = await this.$store.dispatch('getTokenPrice', data)
          if (result){
            // console.log('result', result)
            this.twdResult = this.egtAmount ? (this.egtAmount * result.ethereum.twd / 1200).toFixed(2) : null
            this.updateTime = result.ethereum.last_updated_at * 1000
          }else{
            this.$toasted.error(this.$t('errorOccured'))
          }
        }catch (error){
          // console.log('error', error)
          this.$toasted.error(this.$t('errorOccured'))
        }
      }
    }
  }
}
</script>
