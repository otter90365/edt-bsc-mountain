<template>
  <v-dialog persistent v-model="warningShow" max-width="600" width="90%">
    <!-- 風險提示 -->
    <v-card v-if="page!=='rule'" dark color="secondary" class="d-flex flex-column justify-center align-center pa-md-10 pa-5">
      <h2 class="primary--text mb-5">{{ $t('warning') }}</h2>
      <div class="font-weight-bold">
        <p>{{ $t('warningRegistry') }}</p>
        <btn class="mb-3" noRounded isCenter :buttonText="'toRegistry'" color="white" @clickBtn="$router.push({name: 'Defi-registry'})"></btn>
        <p>{{page==='borrow' ? $t('warningBorrow') : $t('warningDeposit')}}</p>
        <p>{{ $t('warningCalculate') }}</p>
      </div>
      <btn class="mb-3" noRounded isCenter :buttonText="'toCalculator'" color="white" @clickBtn="$router.push({name: 'Calculator'})"></btn>
      <v-checkbox v-model="isConfirm" :color="`primary`">
        <template v-slot:label>
          <div :class="`white--text`">{{ $t('agree') }}</div>
        </template>
      </v-checkbox>
      <imgBtn type="bg-white" style="width: 270px;" :buttonText="'confirm'" @clickBtn="confirm()"></imgBtn>
    </v-card>

    <!--彩金池規則-->
    <v-card v-else id="rule" class="d-flex flex-column justify-center align-center pa-md-10 pa-5">
      <h3 class="mb-5" :class="`primary--text`">{{ content }}</h3>
      <div class="font-weight-bold">
        <ol class="mb-5 text-left">
          <li v-for="(text, i) in rules" :key="i" style="white-space: pre-wrap;" v-text="text"></li>
        </ol>
      </div>
      <btn :buttonText="'確認'" :width="270" :color="`primary`" @clickBtn="closeRule()"></btn>
    </v-card>
  </v-dialog>
</template>
<script>
import btn from '@/components/btn.vue'
import imgBtn from '@/components/imgBtn.vue'
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
    imgBtn
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