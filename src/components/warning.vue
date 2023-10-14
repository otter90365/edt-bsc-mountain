<template>
  <v-dialog persistent v-model="warningShow" max-width="600" width="90%">
    <!-- 風險提示 -->
    <v-card v-if="page!=='rule'" class="d-flex flex-column justify-center align-center pa-md-10 pa-5">
      <h2 class="red--text mb-5">{{ $t('warning') }}</h2>
      <div class="font-weight-bold">
        <p>{{ $t('warningRegistry') }}</p>
        <h3 class="text-decoration-underline can-click text-center mb-3" :class="`primary_${$route.params.token}--text`" @click="$router.push({name: 'Defi-registry'})">{{ $t('toRegistry') }}</h3>
        <p>{{page==='borrow' ? $t('warningBorrow') : $t('warningDeposit')}}</p>
        <p>{{ $t('warningCalculate') }}</p>
      </div>
      <h3 class="text-decoration-underline can-click" :class="`primary_${$route.params.token}--text`" @click="$router.push({name: 'Calculator'})">{{ $t('toCalculator') }}</h3>
      <v-checkbox v-model="isConfirm" :color="`primary_${$route.params.token}`">
        <template v-slot:label>
          <div :class="`primary_${$route.params.token}--text`">{{ $t('agree') }}</div>
        </template>
      </v-checkbox>
      <btn :buttonText="'confirm'" :color="`primary_${$route.params.token}`" :width="270" @clickBtn="confirm()"></btn>
    </v-card>

    <!--彩金池規則-->
    <v-card v-else id="rule" class="d-flex flex-column justify-center align-center pa-md-10 pa-5">
      <h3 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ content }}</h3>
      <div class="font-weight-bold">
        <ol class="mb-5 text-left">
          <li v-for="(text, i) in rules" :key="i" style="white-space: pre-wrap;" v-text="text"></li>
        </ol>
      </div>
      <btn :buttonText="'確認'" :width="270" :color="`primary_${$route.params.token}`" @clickBtn="closeRule()"></btn>
    </v-card>
  </v-dialog>
</template>
<script>
import btn from '@/components/btn.vue'
export default {
  name: 'warning',
  props:{
    warningShow: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
    page: {
      type: String,
      default: 'borrow',
    },
    rules: {
      type: [Array, String],
      default: ()=> {
        return []
      }
    }
  },
  data(){
    return {
      isConfirm: false
    }
  },
  components:{
    btn,
  },
  methods:{
    confirm(){
      if (this.isConfirm){
        this.$emit('confirm')
      }else{
        this.$toasted.error(this.$t('agreeFirst'))
      }
    },
    closeRule(){
      this.$emit('closeRule')
    }
  },
}
</script>